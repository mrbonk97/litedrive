import { FolderType } from "@/types";
import { translateSupabaseError } from "@/lib/utils";

export async function getFolderBreadcrumb(
  supabase: Awaited<
    ReturnType<typeof import("@/lib/supabase/server").createClient>
  >,
  folderId: string,
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");
  const breadcrumbs: FolderType[] = [];
  const visitedIds = new Set<string>();

  let currentId: string | null = folderId;

  while (currentId) {
    if (visitedIds.has(currentId)) {
      throw new Error("폴더 경로에 순환 참조가 있습니다.");
    }
    visitedIds.add(currentId);

    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("id", currentId)
      .eq("user_id", user.id)
      .maybeSingle();
    const folder = data as FolderType | null;

    if (error) {
      throw new Error(translateSupabaseError(error));
    }

    if (!folder) {
      break;
    }

    breadcrumbs.push(folder);
    currentId = folder.parent_id;
  }

  return breadcrumbs.reverse();
}
