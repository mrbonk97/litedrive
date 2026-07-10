"use server";

import { createClient } from "@/lib/supabase/server";

export async function deleteFolder(folderId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("로그인이 필요합니다.");
  const { data, error } = await supabase.from("folders").delete()
    .eq("id", folderId).eq("user_id", user.id).select("id").maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("폴더를 찾을 수 없습니다.");
}
