import { createClient } from "@supabase/supabase-js";
import { AppException, ExceptionCode } from "@/lib/errors";

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl) {
    throw new AppException(ExceptionCode.CONFIGURATION_ERROR);
  }

  if (!secretKey) {
    throw new AppException(ExceptionCode.CONFIGURATION_ERROR);
  }

  return createClient(supabaseUrl, secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
