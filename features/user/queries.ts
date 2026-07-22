import type { createClient } from "@/lib/supabase/server";
import { translateSupabaseError } from "@/lib/utils";
import { AppException, ExceptionCode } from "@/lib/errors";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function getAutoDeleteEnabled(
  supabase: SupabaseClient,
) {
  const { data, error } = await supabase
    .from("user_settings")
    .select("auto_delete_enabled")
    .maybeSingle();

  if (error) {
    throw new AppException(
      ExceptionCode.INTERNAL_ERROR,
      translateSupabaseError(error),
    );
  }

  return data?.auto_delete_enabled ?? false;
}
