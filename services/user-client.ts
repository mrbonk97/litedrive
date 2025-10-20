"use client";

export async function updateUserPassword(oldPassword: string, newPassword: string) {
  const res = await fetch("/api/users/me", {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  const { message } = await res.json();
  if (!res.ok) throw new Error(message || "패스워드 수정 중 오류가 발생했습니다.");

  return { message: message || "패스워드 수정 성공" };
}

export async function deleteUser(password: string) {
  const res = await fetch("/api/users/me", {
    method: "DELETE",
    credentials: "include",
    body: JSON.stringify({ password }),
  });

  const { message } = await res.json();
  if (!res.ok) throw new Error(message || "회원 탈퇴 중 오류가 발생했습니다.");

  return { message: message || "회원 탈토 성공" };
}

export async function signIn(username: string, password: string) {
  const res = await fetch("/api/sign-in", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  const { message } = await res.json();
  if (!res.ok) throw new Error(message || "로그인 중 오류가 발생했습니다.");

  return { message: message || "로그인 성공" };
}

export async function signUp(username: string, password: string) {
  const res = await fetch("/api/sign-up", {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });

  const { message } = await res.json();
  if (!res.ok) throw new Error(message || "회원가입 중 오류가 발생했습니다.");

  return { message: message || "회원가입 성공" };
}

export async function signOut() {
  const res = await fetch("/api/sign-out", {
    method: "GET",
    credentials: "include",
  });

  const { message } = await res.json();
  if (!res.ok) throw new Error(message || "로그아웃 중 오류가 발생했습니다.");

  return { message: message || "로그아웃 성공" };
}
