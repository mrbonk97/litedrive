import { SignInPayload, SignUpPayload } from "./auth.type";

export async function SignIn(payload: SignInPayload) {
  const { username, password } = payload;

  const res = await fetch("/api/sign-in", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("로그인 중 오류 발생");
  }
}

export async function SignUp(payload: SignUpPayload) {
  const { username, password } = payload;

  const res = await fetch("/api/sign-up", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error("회원가입 중 오류 발생");
  }
}

export async function signOut() {
  const res = await fetch("/api/sign-out", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message ?? "로그아웃 중 오류가 발생했습니다.");
  }
}
