export async function signOutAction() {
  const res = await fetch("/api/sign-out", {
    method: "GET",
    credentials: "include",
  });

  const { message } = await res.json();
  if (!res.ok) throw new Error(message || "로그아웃 중 오류가 발생했습니다.");

  return { message: message || "로그아웃 성공" };
}
