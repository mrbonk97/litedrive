"use server";

import { createClient } from "@/lib/supabase/server";

export async function renameFile(fileId: string, name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다.");

  const { data, error } = await supabase
    .from("files")
    .update({ name: name.trim() })
    .eq("id", fileId)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("파일을 찾을 수 없습니다.");
}
