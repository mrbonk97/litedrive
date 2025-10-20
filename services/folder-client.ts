export async function createFolder(name: string, parentFolderId: number) {
  const res = await fetch(`/api/folders/${parentFolderId}`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ name }),
  });

  const { message } = await res.json();

  if (!res.ok) {
    throw new Error(message || "폴더 생성 중 오류가 발생했습니다.");
  }

  return { message: message || "폴더 생성 성공" };
}

export async function updateFolderById(id: number, parentFolderId: number, name: string) {
  const res = await fetch(`/api/folders/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify({ name, parentFolderId }),
  });

  const { message } = await res.json();

  if (!res.ok) {
    throw new Error(message || "폴더 수정 중 오류가 발생했습니다.");
  }

  return { message: message || "폴더 수정 성공" };
}

export async function deleteFolderById(id: number) {
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

export async function uploadFileToFolder(id: number, file: File) {
  const formData = new FormData();
  formData.set("file", file);

  const res = await fetch(`/api/folders/${id}/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const { message } = await res.json();

  if (!res.ok) {
    throw new Error(message || "파일 업로드 중 중 오류가 발생했습니다.");
  }

  return { message: message || "파일 업로드 성공" };
}
