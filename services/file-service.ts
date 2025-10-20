export async function uploadFile(folderId: string, formData: FormData) {
  const res = await fetch(`/api/folders/${folderId}/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const { message } = await res.json();

  if (!res.ok) {
    throw new Error(message || "파일 업로드 중 오류가 발생했습니다.");
  }

  return { message: message || "파일 업로드 성공" };
}

export async function updateFileById(id: number, name: string, folderId: number) {
  const res = await fetch(`/api/files/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify({ name, folderId: folderId ? folderId : 0 }),
  });

  const { message } = await res.json();

  if (!res.ok) {
    throw new Error(message || "파일 수정 중 오류가 발생했습니다.");
  }

  return { message: message || "파일 수정 성공" };
}

export async function shareFileById(id: number) {
  const res = await fetch(`/api/files/${id}/share`, {
    method: "PATCH",
    credentials: "include",
  });

  const { message } = await res.json();

  if (!res.ok) {
    throw new Error(message || "파일 공유 상태 변경 중 오류가 발생했습니다.");
  }

  return { message: message || "파일 공유 상태 변경 성공" };
}

export async function deleteFileById(id: number) {
  const res = await fetch(`/api/files/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const { message } = await res.json();

  if (!res.ok) {
    throw new Error(message || "파일 삭제 중 오류가 발생했습니다.");
  }

  return { message: message || "파일 삭제 성공" };
}

export async function checkShareFile(code: string) {
  const res = await fetch(`/api/download/check?code=${code}`, {
    method: "GET",
  });

  const { file, message } = await res.json();

  if (!res.ok) {
    throw new Error(message || "공유 파일 확인 중 오류가 발생했습니다.");
  }

  return { message: message || "공유 파일 확인 성공", file: file };
}
