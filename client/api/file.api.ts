import { FileType } from "@/types";
import {
  DeleteFilePayload,
  DownloadFileByCodePayload,
  DownloadFilePayload,
  FindFileByCodePayload,
  UpdateFilePayload,
  UploadFilePayload,
} from "./file.type";

export async function downloadFile(payload: DownloadFilePayload) {
  const res = await fetch(`/api/files/${payload.id}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message ?? "파일 다운로드 요청 중 요류가 발생했습니다.");
  }

  return await res.json();
}

export async function uploadFile(
  payload: UploadFilePayload
): Promise<{ file: FileType; token: string }> {
  const res = await fetch(`/api/files`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "파일 업로드 중 오류가 발생했습니다.");
  }

  return await res.json();
}

export async function updateFile(payload: UpdateFilePayload) {
  const { id, ...rest } = payload;

  const res = await fetch(`/api/files/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify(rest),
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "파일 수정 중 오류가 발생했습니다.");
  }
}

export async function deleteFile(payload: DeleteFilePayload) {
  const res = await fetch(`/api/files/${payload.id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "파일 삭제 중 오류가 발생했습니다.");
  }
}

export async function findFileByCode(payload: FindFileByCodePayload) {
  const res = await fetch(`/api/check?code=${payload.code}`);

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "공유 파일 확인 중 오류가 발생했습니다.");
  }

  return await res.json();
}

export async function downloadFileByCode(payload: DownloadFileByCodePayload) {
  const res = await fetch(`/api/download?code=${payload.code}`);

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "파일 다운로드 중 오류가 발생했습니다.");
  }

  return await res.json();
}
