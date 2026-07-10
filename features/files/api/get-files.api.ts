import { FileType } from "@/types";
import type { createClient } from "@/lib/supabase/server";
import { translateSupabaseError } from "@/lib/utils";

type supabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function getFiles(
  supabase: supabaseClient,
  folderId: string | null,
  searchQuery?: string,
): Promise<FileType[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다.");

  let query = supabase.from("files").select("*").eq("user_id", user.id);

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
    throw new Error(translateSupabaseError(error));
  }

  return data ?? [];
}
