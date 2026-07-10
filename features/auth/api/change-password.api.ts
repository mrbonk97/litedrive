import { createClient } from "@/lib/supabase/client";

type SupabaseClient = ReturnType<typeof createClient>;

export async function changePassword(
  client: SupabaseClient,
  oldPassword: string,
  newPassword: string,
) {
  const { error } = await client.auth.updateUser({
    current_password: oldPassword,
    password: newPassword,
  });

  if (error) {
    return { error };
  }

  await client.auth.signOut();
  return { error: null };
}
