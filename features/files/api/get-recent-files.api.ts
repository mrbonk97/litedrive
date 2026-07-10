import type { createClient } from "@/lib/supabase/server";
import { translateSupabaseError } from "@/lib/utils";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function getRecentFiles(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("files")
    .select("id, name, size, mime_type, is_shared, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(translateSupabaseError(error));
  }

  return data ?? [];
}
