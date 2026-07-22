import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { deleteR2Object } from "@/lib/storage/r2";

const DELETE_BATCH_SIZE = 100;

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: files, error } = await admin
    .from("files")
    .select("id, storage_path, user_id")
    .not("auto_delete_at", "is", null)
    .lte("auto_delete_at", new Date().toISOString())
    .order("auto_delete_at", { ascending: true })
    .limit(DELETE_BATCH_SIZE);

  if (error) {
    return NextResponse.json({ error: "Failed to load files" }, { status: 500 });
  }

  const failedFileIds: string[] = [];

  for (const file of files ?? []) {
    try {
      await deleteR2Object(file.storage_path);
      const { error: deleteError } = await admin
        .from("files")
        .delete()
        .eq("id", file.id)
        .eq("user_id", file.user_id);

      if (deleteError) failedFileIds.push(file.id);
    } catch {
      failedFileIds.push(file.id);
    }
  }

  return NextResponse.json({
    processed: files?.length ?? 0,
    deleted: (files?.length ?? 0) - failedFileIds.length,
    failedFileIds,
  });
}
