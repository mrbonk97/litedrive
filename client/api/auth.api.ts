import { SignInPayload, SignUpPayload } from "./auth.type";

export async function signIn(payload: SignInPayload) {
  const { username, password } = payload;

  const res = await fetch("/api/sign-in", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "로그인 중 오류 발생");
  }
}

export async function signUp(payload: SignUpPayload) {
  const { username, password } = payload;

  const res = await fetch("/api/sign-up", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "회원가입 중 오류 발생");
  }
}

export async function signOut() {
  const res = await fetch("/api/sign-out", {
    method: "GET",
    credentials: "include",
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "로그아웃 중 오류 발생");
  }
}
