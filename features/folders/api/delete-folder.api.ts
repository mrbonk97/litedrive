"use server";

import { createClient } from "@/lib/supabase/server";
import { AppException, ExceptionCode } from "@/lib/errors";

export async function deleteFolder(folderId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("folders")
    .delete()
    .eq("id", folderId)
    .select("id")
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new AppException(ExceptionCode.NOT_FOUND, "폴더를 찾을 수 없습니다.");
  }
}
