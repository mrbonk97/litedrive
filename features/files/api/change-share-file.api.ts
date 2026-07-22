"use server";

import { createClient } from "@/lib/supabase/server";
import { AppException, ExceptionCode } from "@/lib/errors";

export async function changeShareFile(fileId: string, isShared: boolean) {
  const supabase = await createClient();

  const { data: file } = await supabase
    .from("files")
    .select("id")
    .eq("id", fileId)
    .eq("upload_status", "success")
    .maybeSingle();

  if (!file) {
    throw new AppException(ExceptionCode.NOT_FOUND, "파일을 찾을 수 없습니다.");
  }

  const { data, error } = await supabase.rpc(
    isShared ? "disable_file_share" : "enable_file_share",
    { p_file_id: fileId },
  );

  if (error) throw error;
  return data;
}
