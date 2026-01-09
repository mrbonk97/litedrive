import { FileType, UploadStatusType } from "@/types";

export async function downloadFileAction(fileId: string) {
  const res = await fetch(`/api/files/${fileId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "파일 다운로드 중 오류 발생");
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

  const {
    file: uploadedFile,
    url,
    message,
  }: { file: FileType; url: string; message: string } = await res1.json();

  if (!res1.ok) {
    throw new Error(message || "파일 생성 중 오류가 발생했습니다.");
  }

  // STEP 2. presignedUrl로 파일 업로드
  const formData = new FormData();
  formData.append("body", file);
  const res2 = await fetch(url, {
    method: "PUT",
    body: formData,
    mode: "cors",
  });

  // STEP 3. 업로드 완료
  await updateFileAction(uploadedFile.id, {
    uploadStatus: res2.ok ? "success" : "failed",
  });

  if (!res2.ok) {
    return { message: "파일 업로드 실패" };
  }

  return { message: "파일 업로드 성공" };
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

  const { message } = await res.json();

  if (!res.ok) {
    throw new Error(message || "파일 수정 중 오류가 발생했습니다.");
  }

  return { message: message || "파일 수정 성공" };
}

export async function deleteFileAction(id: string) {
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
