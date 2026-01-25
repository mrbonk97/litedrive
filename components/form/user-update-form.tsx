"use client";

import { toast } from "sonner";
import { FormEvent, useRef } from "react";
import { updateUser } from "@/client/api/user.api";
import { useMutation } from "@tanstack/react-query";
import { UpdateUserPayload } from "@/client/api/user.type";
import { UserDeleteModal } from "@/components/modal/user-delete-modal";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";

export function UserUpdateForm() {
  const ref = useRef<HTMLFormElement>(null);
  const { mutate, isPending } = useMutation({
    mutationFn: (payLoad: UpdateUserPayload) => updateUser(payLoad),
    onSuccess: () => {
      toast.success("패스워드 수정 성공");
      ref.current?.reset();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const oldPassword = formData.get("oldPassword")!.toString();
    const newPassword = formData.get("newPassword")!.toString();
    const newPasswordConfirm = formData.get("newPasswordConfirm")!.toString();

    if (newPassword !== newPasswordConfirm) {
      toast.error("비밀번호 확인이 일치하지 않습니다");
      return;
    }

    mutate({ oldPassword, newPassword });
  };

  return (
    <form ref={ref} onSubmit={handleSubmit} className="mt-2 space-y-4">
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
        <Button className="w-full">
          {isPending ? <Spinner /> : "비밀번호 수정"}
        </Button>
      </div>
    </form>
  );
}
