import type { createClient } from "@/lib/supabase/server";
import { translateSupabaseError } from "@/lib/utils";
import { AppException, ExceptionCode } from "@/lib/errors";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function getRecentFiles(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("files")
    .select("id, name, size, mime_type, is_shared, created_at")
    .in("upload_status", ["pending", "success"])
    .order("created_at", { ascending: false });

  if (error) {
    throw new AppException(
      ExceptionCode.INTERNAL_ERROR,
      translateSupabaseError(error),
    );
  }

  return data ?? [];
}
