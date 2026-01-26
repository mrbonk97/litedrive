import { cookies } from "next/headers";

export async function getUserMe() {
  const cookie = await cookies();
  const session = cookie.get("litedrive_session")?.value;

  const res = await fetch(`${process.env.API_URL}/users/me`, {
    method: "GET",
    headers: {
      Cookie: `litedrive_session=${session}`,
    },
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "나의 정보 조회 중 오류가 발생했습니다.");
  }

  return await res.json();
}
