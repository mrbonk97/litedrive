"use server";

import { createClient } from "@/lib/supabase/server";
import { AppException, ExceptionCode } from "@/lib/errors";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

interface UpdateFolderInput {
  name?: string;
  parentId?: string | null;
}

interface FolderParent {
  id: string;
  parent_id: string | null;
}

export async function updateFolder(folderId: string, input: UpdateFolderInput) {
  const supabase = await createClient();
  const values: { name?: string; parent_id?: string | null } = {};

  if (input.name !== undefined) {
    const name = input.name.trim();

    if (!name) {
      throw new AppException(
        ExceptionCode.INVALID_INPUT,
        "폴더 이름을 입력해주세요.",
      );
    }

    values.name = name;
  }

  if (input.parentId !== undefined) {
    if (input.parentId) {
      const { data: target } = await supabase
        .from("folders")
        .select("id, parent_id")
        .eq("id", input.parentId)
        .maybeSingle();

      if (!target) {
        throw new AppException(
          ExceptionCode.NOT_FOUND,
          "대상 폴더를 찾을 수 없습니다.",
        );
      }

      await validateParentFolder(supabase, folderId, target);
    }

    values.parent_id = input.parentId;
  }

  if (Object.keys(values).length === 0) {
    throw new AppException(ExceptionCode.INVALID_INPUT);
  }

  const { data, error } = await supabase
    .from("folders")
    .update(values)
    .eq("id", folderId)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    throw new AppException(ExceptionCode.NOT_FOUND, "폴더를 찾을 수 없습니다.");
  }
}

async function validateParentFolder(
  supabase: SupabaseClient,
  folderId: string,
  target: FolderParent,
) {
  const visitedIds = new Set<string>();
  let current: FolderParent | null = target;

  while (current) {
    if (current.id === folderId) {
      throw new AppException(
        ExceptionCode.INVALID_INPUT,
        "하위 폴더로 이동할 수 없습니다.",
      );
    }

    if (visitedIds.has(current.id)) {
      throw new AppException(
        ExceptionCode.CONFLICT,
        "폴더 경로가 올바르지 않습니다.",
      );
    }

    visitedIds.add(current.id);

    if (!current.parent_id) break;

    const { data } = await supabase
      .from("folders")
      .select("id, parent_id")
      .eq("id", current.parent_id)
      .maybeSingle();

    current = data as FolderParent | null;
  }
}
