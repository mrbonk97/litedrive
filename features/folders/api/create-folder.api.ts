"use server";

import { createClient } from "@/lib/supabase/server";
import { AppException, ExceptionCode } from "@/lib/errors";

export async function createFolder(name: string, parentId: string | null) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new AppException(ExceptionCode.AUTH_REQUIRED);

  if (parentId) {
    const { data: parent } = await supabase
      .from("folders")
      .select("id")
      .eq("id", parentId)
      .maybeSingle();

    if (!parent) {
      throw new AppException(ExceptionCode.NOT_FOUND, "폴더를 찾을 수 없습니다.");
    }
  }

  const { error } = await supabase.from("folders").insert({
    name: name.trim(),
    parent_id: parentId,
    user_id: user.id,
  });

  if (error) throw error;
}
