export async function uploadtoS3(url: string, file: File) {
  const formData = new FormData();

  formData.append("body", file);
  const res = await fetch(url, {
    method: "PUT",
    body: formData,
    mode: "cors",
  });

  if (!res.ok) {
    throw new Error("s3에 업로드 중 오류가 발생했습니다.");
  }
}
