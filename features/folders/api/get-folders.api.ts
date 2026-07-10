import { FolderType } from "@/types";
import type { createClient } from "@/lib/supabase/server";
import { translateSupabaseError } from "@/lib/utils";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function getFolders(
  supabase: SupabaseServerClient,
  parentId: string | null,
  searchQuery?: string,
): Promise<FolderType[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");
  let query = supabase.from("folders").select("*").eq("user_id", user.id);
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
    throw new Error(translateSupabaseError(error));
  }

  return data ?? [];
}
