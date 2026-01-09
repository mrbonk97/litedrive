export async function createFolderAction(
  name: string,
  parentFolderId: string | null
) {
  const res = await fetch("/api/folders", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ name, parentFolderId }),
  });

  const { message } = await res.json();

  if (!res.ok) {
    throw new Error(message || "폴더 생성 중 오류가 발생했습니다.");
  }

  return { message: message || "폴더 생성 성공" };
}

type UpdateFolderPayload = {
  name?: string;
  parentFolderId?: string | null;
};

export async function updateFolderAction(
  id: string,
  payload: UpdateFolderPayload
) {
  const res = await fetch(`/api/folders/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const { message } = await res.json();

  if (!res.ok) {
    throw new Error(message || "폴더 수정 중 오류가 발생했습니다.");
  }

  return { message: message || "폴더 수정 성공" };
}

export async function deleteFolderAction(id: string) {
  const res = await fetch(`/api/folders/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const { message } = await res.json();

  if (!res.ok) {
    throw new Error(message || "폴더 삭제 중 오류가 발생했습니다.");
  }

  return { message: message || "폴더 삭제 성공" };
}
