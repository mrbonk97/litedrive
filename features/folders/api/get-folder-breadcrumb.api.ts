import type { FolderType } from "@/types";
import type { createClient } from "@/lib/supabase/server";
import { translateSupabaseError } from "@/lib/utils";
import { AppException, ExceptionCode } from "@/lib/errors";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function getFolderBreadcrumb(
  supabase: SupabaseClient,
  folderId: string,
): Promise<FolderType[]> {
  const breadcrumbs: FolderType[] = [];
  const visitedIds = new Set<string>();

  let currentId: string | null = folderId;

  while (currentId) {
    if (visitedIds.has(currentId)) {
      throw new AppException(
        ExceptionCode.CONFLICT,
        "폴더 경로에 순환 참조가 있습니다.",
      );
    }
    visitedIds.add(currentId);

    const { data, error } = await supabase
      .from("folders")
      .select("*")
      .eq("id", currentId)
      .maybeSingle();
    const folder = data as FolderType | null;

    if (error) {
      throw new AppException(
        ExceptionCode.INTERNAL_ERROR,
        translateSupabaseError(error),
      );
    }

    if (!folder) {
      break;
    }

    breadcrumbs.push(folder);
    currentId = folder.parent_id;
  }

  return breadcrumbs.reverse();
}
