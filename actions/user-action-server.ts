import { cookies } from "next/headers";

export async function getUserInfoAction() {
  const cookieStore = await cookies();

  const res = await fetch(`${process.env.API_URL}/users/me`, {
    method: "GET",
    headers: { Cookie: cookieStore.toString() },
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "사용자 조회 중 오류가 발생했습니다.");
  }

  const { user } = await res.json();
  return { user: user };
}
