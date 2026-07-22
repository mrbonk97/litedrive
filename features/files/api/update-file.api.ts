"use server";

import { createClient } from "@/lib/supabase/server";
import { AppException, ExceptionCode } from "@/lib/errors";

interface UpdateFileInput {
  name?: string;
  folderId?: string | null;
}

export async function updateFile(fileId: string, input: UpdateFileInput) {
  const supabase = await createClient();
  const values: { name?: string; folder_id?: string | null } = {};

  if (input.name !== undefined) {
    const name = input.name.trim();

    if (!name) {
      throw new AppException(
        ExceptionCode.INVALID_INPUT,
        "파일 이름을 입력해주세요.",
      );
    }

    values.name = name;
  }

  if (input.folderId !== undefined) {
    if (input.folderId) {
      const { data: folder } = await supabase
        .from("folders")
        .select("id")
        .eq("id", input.folderId)
        .maybeSingle();

      if (!folder) {
        throw new AppException(
          ExceptionCode.NOT_FOUND,
          "대상 폴더를 찾을 수 없습니다.",
        );
      }
    }

    values.folder_id = input.folderId;
  }

  if (Object.keys(values).length === 0) {
    throw new AppException(ExceptionCode.INVALID_INPUT);
  }

  const { data, error } = await supabase
    .from("files")
    .update(values)
    .eq("id", fileId)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  if (!data) {
    throw new AppException(ExceptionCode.NOT_FOUND, "파일을 찾을 수 없습니다.");
  }
}
