"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { deleteR2Object } from "@/lib/storage/r2";
import { translateSupabaseError } from "@/lib/utils";

interface DeleteAccountResult {
  error: string | null;
}

export async function deleteAccount(
): Promise<DeleteAccountResult> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "로그인이 필요합니다." };
  }

  const admin = createAdminClient();

  const { data: files, error: filesError } = await admin
    .from("files")
    .select("storage_path")
    .eq("user_id", user.id);

  if (filesError) {
    return { error: translateSupabaseError(filesError) };
  }

  for (const file of files ?? []) {
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
  }

  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return { error: translateSupabaseError(deleteError) };
  }

  await supabase.auth.signOut();

  return { error: null };
}
