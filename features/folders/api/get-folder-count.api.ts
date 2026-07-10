import type { createClient } from "@/lib/supabase/server";
import { translateSupabaseError } from "@/lib/utils";

type supabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function getFolderCount(supabase: supabaseClient, userId: string) {
  const { count, error } = await supabase
    .from("folders")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("user_id", userId);

  if (error) {
    throw new Error(translateSupabaseError(error));
  }

  return count ?? 0;
}
