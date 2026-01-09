"use client";

import Form from "next/form";
import { toast } from "sonner";
import { safeAwait } from "@/lib/safe-await";
import { SubmitButton } from "@/components/submit-button";
import { updatePasswordAction } from "@/actions/user-action-client";
import { UserDeleteModal } from "@/components/modal/user-delete-modal";

export function UserUpdateForm() {
  const onSubmit = async (formData: FormData) => {
    const oldPassword = formData.get("oldPassword")?.toString();
    const newPassword = formData.get("newPassword")?.toString();
    const newPasswordConfirm = formData.get("newPasswordConfirm")?.toString();

    if (!oldPassword || !newPassword) {
      toast.error("패스워드를 입력해주세요");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다");
      return;
    }

    const [, error] = await safeAwait(
      updatePasswordAction(oldPassword, newPassword)
    );

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("수정 완료");
  };

  return (
    <Form action={onSubmit} className="mt-2 space-y-4">
      <label htmlFor="oldPassword" className="sr-only">
        기존 비밀번호
      </label>
      <input
        type="password"
        id="oldPassword"
        name="oldPassword"
        placeholder="기존 비밀번호를 입력해주세요"
        className="p-4 w-full rounded border"
        required
        minLength={4}
      />
      <label htmlFor="newPassword" className="sr-only">
        새로운 비밀번호
      </label>
      <input
        type="password"
        id="newPassword"
        name="newPassword"
        placeholder="새로운 비밀번호를 입력해주세요"
        className="p-4 w-full rounded border"
        required
        minLength={4}
      />
      <label htmlFor="newPasswordConfirm" className="sr-only">
        비밀번호 확인
      </label>
      <input
        type="password"
        id="newPasswordConfirm"
        name="newPasswordConfirm"
        placeholder="비밀번호 확인"
        className="p-4 w-full rounded border"
        required
        minLength={4}
      />
      <div className="flex gap-2">
        <UserDeleteModal />
        <SubmitButton text="비밀번호 수정" className="w-full" />
      </div>
    </Form>
  );
}
