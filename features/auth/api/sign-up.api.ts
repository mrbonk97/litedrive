import { createClient } from "@/lib/supabase/client";
import { createInternalEmail } from "@/lib/utils";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function signUp(
  supabase: SupabaseClient,
  username: string,
  password: string,
) {
  const { error } = await supabase.auth.signUp({
    email: createInternalEmail(username),
    password: password,
    options: {
      emailRedirectTo: `${window.location.origin}/folders`,
    },
  });

  if (error) {
    console.error(error);
    throw error;
  }
}
