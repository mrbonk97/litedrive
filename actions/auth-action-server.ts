export async function signOutAction() {
  const res = await fetch("/api/sign-out", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message ?? "로그아웃 중 오류가 발생했습니다.");
  }
}
