import { UploadToR2Payload } from "./r2.type";

export async function uploadToR2(payload: UploadToR2Payload) {
  const { token, file } = payload;

  const res = await fetch(process.env.NEXT_PUBLIC_WORKER_ENDPOINT!, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/octet-stream",
    },
    body: file,
  });

  if (!res.ok) {
    console.log(res);
    throw new Error("파일 업로드 중 오류 발생");
  }
}
