import {
  CreateFolderPayload,
  DeleteFolderPayload,
  GetFolderPayload,
  UpdateFolderPayload,
} from "./folder.type";

export async function createFolder(payLoad: CreateFolderPayload) {
  const res = await fetch("/api/folders", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payLoad),
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "폴더 생성 중 오류가 발생했습니다.");
  }
}

export async function getFolderById(payLoad: GetFolderPayload) {
  const url = payLoad.id ? `/api/folders/${payLoad.id}` : "/api/folders";

  const sp = new URLSearchParams();
  if (payLoad.q) sp.set("q", payLoad.q);
  if (payLoad.filter) sp.set("filter", payLoad.filter);

  const res = await fetch(`${url}?${sp.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "폴더 조회 중 오류가 발생했습니다.");
  }

  return await res.json();
}

export async function updateFolder(payload: UpdateFolderPayload) {
  const { id, ...rest } = payload;

  const res = await fetch(`/api/folders/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify(rest),
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "폴더 수정 중 오류가 발생했습니다.");
  }
}

export async function deleteFolder(payload: DeleteFolderPayload) {
  const res = await fetch(`/api/folders/${payload.id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "폴더 삭제 중 오류가 발생했습니다.");
  }
}
