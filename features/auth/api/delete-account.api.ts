"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { deleteR2Object } from "@/features/files/api/file-transfer.api";
import { translateSupabaseError } from "@/lib/utils";

interface DeleteAccountResult {
  error: string | null;
}

export async function deleteAccount(
  password: string,
): Promise<DeleteAccountResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    return { error: "로그인이 필요합니다." };
  }

  const { error: passwordError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password,
  });

  if (passwordError) {
    return { error: "기존 계정의 패스워드가 올바르지 않습니다." };
  }

  const admin = createAdminClient();

  const { data: files, error: filesError } = await admin
    .from("files")
    .select("id, name")
    .eq("user_id", user.id);

  if (filesError) {
    return { error: translateSupabaseError(filesError) };
  }

  for (const file of files ?? []) {
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
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return { error: translateSupabaseError(deleteError) };
  }

  await supabase.auth.signOut();

  return { error: null };
}
