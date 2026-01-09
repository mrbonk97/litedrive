import { UploadStatusType } from "@/types";

export async function downloadFileAction(fileId: string) {
  const res = await fetch(`/api/files/${fileId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "파일 다운로드 요청 중 요류가 발생했습니다.");
  }

  const { url } = await res.json();
  return url;
}

export async function uploadFileAction(file: File, folderId: string | null) {
  const res1 = await fetch(`/api/files`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({
      name: file.name,
      type: file.type,
      size: file.size,
      folderId: folderId,
    }),
  });

  if (!res1.ok) {
    const { message } = await res1.json();
    throw new Error(message || "파일 생성 중 오류가 발생했습니다.");
  }

  const json1 = await res1.json();

  // STEP 2. presignedUrl로 파일 업로드
  const formData = new FormData();

  formData.append("body", json1.file);
  const res2 = await fetch(json1.url, {
    method: "PUT",
    body: formData,
    mode: "cors",
  });

  // STEP 3. 업로드 완료
  await updateFileAction(json1.id, {
    uploadStatus: res2.ok ? "success" : "failed",
  });

  if (!res2.ok) {
    throw new Error("s3에 업로드 중 오류가 발생했습니다.");
  }
}

type UpdateFilePayload = {
  name?: string;
  folderId?: string | null;
  share?: boolean;
  uploadStatus?: UploadStatusType;
};

export async function updateFileAction(id: string, payload: UpdateFilePayload) {
  const res = await fetch(`/api/files/${id}`, {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "파일 수정 중 오류가 발생했습니다.");
  }
}

export async function deleteFileAction(id: string) {
  const res = await fetch(`/api/files/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "파일 삭제 중 오류가 발생했습니다.");
  }
}

export async function downloadSharedFileAction(
  type: "check" | "download",
  code: string
) {
  const res = await fetch(`/api/download/?type=${type}&code=${code}`);

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "공유 파일 확인 중 오류가 발생했습니다.");
  }

  if (type === "check") {
    const { file } = await res.json();
    return file;
  }

  if (type === "download") {
    const { url } = await res.json();
    return url;
  }
}
