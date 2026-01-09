export async function deleteUserAction(password: string) {
  const res = await fetch(`/api/users/me`, {
    method: "DELETE",
    body: JSON.stringify({ password }),
    credentials: "include",
  });

  const { user, message } = await res.json();

  if (!res.ok) throw new Error(message || "탈퇴 중 오류가 발생했습니다.");

  return { user: user, message: message || "탈퇴 성공" };
}

export async function updatePasswordAction(
  oldPassword: string,
  newPassword: string
) {
  const res = await fetch("/api/users/me", {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify({ oldPassword, newPassword }),
  });

  const { message } = await res.json();
  if (!res.ok)
    throw new Error(message || "패스워드 수정 중 오류가 발생했습니다.");

  return { message: message || "패스워드 수정 성공" };
}
