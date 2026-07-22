import { FileWithAuthorType } from "@/types";
import type { createClient } from "@/lib/supabase/server";
import { translateSupabaseError } from "@/lib/utils";
import { AppException, ExceptionCode } from "@/lib/errors";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function getFiles(
  supabase: SupabaseClient,
  folderId: string | null,
  searchQuery?: string,
): Promise<FileWithAuthorType[]> {
  let query = supabase
    .from("files")
    .select("*, author:profiles!files_user_profile_fkey(username)")
    .in("upload_status", ["pending", "success"]);

  const trimmedQuery = searchQuery?.trim();

  if (trimmedQuery) {
    query = query.ilike("name", `%${trimmedQuery}%`);
  }

  if (folderId) {
    query.eq("folder_id", folderId);
  } else {
    query.is("folder_id", null);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    throw new AppException(
      ExceptionCode.INTERNAL_ERROR,
      translateSupabaseError(error),
    );
  }

  return (data as FileWithAuthorType[] | null) ?? [];
}
