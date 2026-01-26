import { DeleteUserPayload, UpdateUserPayload } from "./user.type";

export async function updateUser(payload: UpdateUserPayload) {
  const res = await fetch("/api/users/me", {
    method: "PATCH",
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("패스워드 변경 중 오류 발생");
  }
}

export async function deleteUser(payload: DeleteUserPayload) {
  const res = await fetch("/api/users/me", {
    method: "DELETE",
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("회원 탈퇴 중 중 오류 발생");
  }
}
