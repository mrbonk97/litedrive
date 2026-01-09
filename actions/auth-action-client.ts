export async function signInAction(username: string, password: string) {
  const res = await fetch("/api/sign-in", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message ?? "로그인 중 오류가 발생했습니다.");
  }
}

export async function signUpAction(username: string, password: string) {
  const res = await fetch("/api/sign-up", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message ?? "회원가입 중 오류가 발생했습니다.");
  }
}
