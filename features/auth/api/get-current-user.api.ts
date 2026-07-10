import { cache } from "react";
import { createClient } from "@/lib/supabase/client";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export const getCurrentUser = cache(async (supabase: SupabaseClient) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
});
