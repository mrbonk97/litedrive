"use server";

import { createClient } from "@/lib/supabase/server";

export async function createFolder(name: string, parentId: string | null) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다.");

  if (parentId) {
    const { data: parent } = await supabase
      .from("folders")
      .select("id")
      .eq("id", parentId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!parent) throw new Error("폴더를 찾을 수 없습니다.");
  }

  const { error } = await supabase.from("folders").insert({
    name: name.trim(),
    parent_id: parentId,
    user_id: user.id,
  });

  if (error) throw error;
}
