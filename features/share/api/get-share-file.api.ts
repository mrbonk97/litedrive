"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { translateSupabaseError } from "@/lib/utils";
import type { FileType } from "@/types";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/server/rate-limit";

export type SharedFile = Pick<FileType, "id" | "name" | "size" | "mime_type">;

type GetSharedFileResult =
  | {
      data: SharedFile;
      error: null;
    }
  | {
      data: null;
      error: string;
    };

export async function getSharedFile(
  shareCode: string,
): Promise<GetSharedFileResult> {
  const code = shareCode.trim();

  if (!/^[A-Za-z0-9_-]{8,64}$/.test(code)) {
    return { data: null, error: "공유 코드가 올바르지 않습니다." };
  }

  const headerStore = await headers();
  const clientKey = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(`share-lookup:${clientKey}`, 20, 60_000)) {
    return { data: null, error: "잠시 후 다시 시도해주세요." };
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("files")
    .select("id, name, size, mime_type")
    .eq("share_token", code)
    .eq("is_shared", true)
    .eq("upload_status", "success")
    .maybeSingle();

  if (error) {
    return { data: null, error: translateSupabaseError(error) };
  }

  if (!data) {
    return { data: null, error: "파일을 찾을 수 없습니다." };
  }

  return { data, error: null };
}
