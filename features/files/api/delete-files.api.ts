"use server";

import { createClient } from "@/lib/supabase/server";
import { deleteR2Object } from "@/features/files/api/file-transfer.api";
import { translateSupabaseError } from "@/lib/utils";

type DeleteFileResult = {
  error: string | null;
};

export async function deleteFile(fileId: string): Promise<DeleteFileResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "로그인이 필요합니다." };
  }

  const { data: file, error: fileError } = await supabase
    .from("files")
    .select("id, name, user_id")
    .eq("id", fileId)
    .eq("user_id", user.id)
    .single();

  if (fileError || !file) {
    return { error: "파일을 찾을 수 없습니다." };
  }

  try {
    await deleteR2Object(user.id, file.id, file.name);
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? translateSupabaseError(error)
          : "R2 파일 삭제에 실패했습니다.",
    };
  }

  const { error: deleteError } = await supabase
    .from("files")
    .delete()
    .eq("id", file.id)
    .eq("user_id", user.id);

  if (deleteError) {
    return { error: translateSupabaseError(deleteError) };
  }

  return { error: null };
}
