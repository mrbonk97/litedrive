"use server";

import { createClient } from "@/lib/supabase/server";

export async function changeShareFile(fileId: string, isShared: boolean) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다.");

  const { data: file } = await supabase
    .from("files")
    .select("id")
    .eq("id", fileId)
    .eq("user_id", user.id)
    .eq("upload_status", "success")
    .maybeSingle();

  if (!file) throw new Error("파일을 찾을 수 없습니다.");

  const { data, error } = await supabase.rpc(
    isShared ? "disable_file_share" : "enable_file_share",
    { p_file_id: fileId },
  );

  if (error) throw error;
  return data;
}
