export async function uploadToR2(url: string, file: File) {
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": file.type, // 서버에서 서명한 값과 반드시 일치
    },
    body: file,
  });

  if (!res.ok) {
    throw new Error("s3에 업로드 중 오류가 발생했습니다.");
  }
}
