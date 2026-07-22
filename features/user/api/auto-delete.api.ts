"use server";

import { createClient } from "@/lib/supabase/server";
import { translateSupabaseError } from "@/lib/utils";
import { ExceptionCode } from "@/lib/errors";

export async function updateAutoDeleteEnabled(enabled: boolean) {
  if (typeof enabled !== "boolean") {
    return {
      error: "자동 삭제 설정값이 올바르지 않습니다.",
      code: ExceptionCode.INVALID_INPUT,
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("set_auto_delete_enabled", {
    p_enabled: enabled,
  });

  return error
    ? {
        error: translateSupabaseError(error),
        code: ExceptionCode.INTERNAL_ERROR,
      }
    : { error: null, code: null };
}
