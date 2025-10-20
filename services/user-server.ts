import { cookies } from "next/headers";

export async function getUserInfo() {
  const cookieStore = await cookies();

  const res = await fetch(`${process.env.API_URL}/users/me`, {
    method: "GET",
    headers: { Cookie: cookieStore.toString() },
  });

  const { user, message } = await res.json();
  if (!res.ok) throw new Error(message || "사용자 정보를 가져오는 중 오류가 발생했습니다.");

  return { user: user, message: message || "사용자 정보 조회 성공" };
}
