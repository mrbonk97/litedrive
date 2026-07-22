import { FolderWithAuthorType } from "@/types";
import type { createClient } from "@/lib/supabase/server";
import { translateSupabaseError } from "@/lib/utils";
import { AppException, ExceptionCode } from "@/lib/errors";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function getFolders(
  supabase: SupabaseServerClient,
  parentId: string | null,
  searchQuery?: string,
): Promise<FolderWithAuthorType[]> {
  let query = supabase
    .from("folders")
    .select("*, author:profiles!folders_user_profile_fkey(username)");
  const trimmedQuery = searchQuery?.trim();

  if (trimmedQuery) {
    query = query.ilike("name", `%${trimmedQuery}%`);
  } else {
    query =
      parentId === null
        ? query.is("parent_id", null)
        : query.eq("parent_id", parentId);
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

  return (data as FolderWithAuthorType[] | null) ?? [];
}
