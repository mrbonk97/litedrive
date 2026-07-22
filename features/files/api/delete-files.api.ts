"use server";

import { createClient } from "@/lib/supabase/server";
import { deleteR2Object } from "@/lib/storage/r2";
import { translateSupabaseError } from "@/lib/utils";

type DeleteFileResult = {
  error: string | null;
};

export async function deleteFile(fileId: string): Promise<DeleteFileResult> {
  const supabase = await createClient();

  const { data: file, error: fileError } = await supabase
    .from("files")
    .select("id, storage_path")
    .eq("id", fileId)
    .single();

  if (fileError || !file) {
    return { error: "파일을 찾을 수 없습니다." };
  }

  try {
    await deleteR2Object(file.storage_path);
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
    .eq("id", file.id);

  if (deleteError) {
    return { error: translateSupabaseError(deleteError) };
  }

  return { error: null };
}
