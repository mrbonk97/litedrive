import { createClient } from "@/lib/supabase/client";
import { createInternalEmail } from "@/lib/utils";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function signIn(
  supabase: SupabaseClient,
  username: string,
  password: string,
) {
  const { error } = await supabase.auth.signInWithPassword({
    email: createInternalEmail(username),
    password: password,
  });

  if (error) throw error;
}
