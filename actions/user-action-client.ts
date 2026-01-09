export async function deleteUserAction(password: string) {
  const res = await fetch(`/api/users/me`, {
    method: "DELETE",
    body: JSON.stringify({ password }),
    credentials: "include",
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "회원탈퇴 중 오류가 발생했습니다.");
  }
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

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "패스워드 수정 중 오류가 발생했습니다.");
  }
}
