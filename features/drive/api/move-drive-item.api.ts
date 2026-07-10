"use server";

import { createClient } from "@/lib/supabase/server";

interface MoveInput {
  id: string;
  type: "file" | "folder";
  targetFolderId: string | null;
}

export async function moveDriveItem(input: MoveInput) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("로그인이 필요합니다.");

  if (input.targetFolderId) {
    const { data: target } = await supabase
      .from("folders")
      .select("id, parent_id")
      .eq("id", input.targetFolderId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!target) throw new Error("대상 폴더를 찾을 수 없습니다.");

    if (input.type === "folder") {
      const visited = new Set<string>();

      let current: { id: string; parent_id: string | null } | null = target;
      while (current) {
        if (current.id === input.id) {
          throw new Error("하위 폴더로 이동할 수 없습니다.");
        }

        if (visited.has(current.id)) {
          throw new Error("폴더 경로가 올바르지 않습니다.");
        }

        visited.add(current.id);

        if (!current.parent_id) break;

        const parentId = current.parent_id;

        const { data } = await supabase
          .from("folders")
          .select("id, parent_id")
          .eq("id", parentId)
          .eq("user_id", user.id)
          .maybeSingle();

        current = data as { id: string; parent_id: string | null } | null;
      }
    }
  }

  const table = input.type === "file" ? "files" : "folders";

  const values =
    input.type === "file"
      ? { folder_id: input.targetFolderId }
      : { parent_id: input.targetFolderId };

  const { data, error } = await supabase
    .from(table)
    .update(values)
    .eq("id", input.id)
    .eq("user_id", user.id)
    .select("id")
    .maybeSingle();

  if (error) throw error;

  if (!data) throw new Error("이동할 항목을 찾을 수 없습니다.");
}
