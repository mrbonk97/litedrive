"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { DeleteUserPayload } from "@/client/api/user.type";
import { deleteUser } from "@/client/api/user.api";
import { FormEvent } from "react";
import { Spinner } from "@/components/spinner";

export function UserDeleteModal() {
  const router = useRouter();
  const { mutate, isPending } = useMutation({
    mutationFn: (payLoad: DeleteUserPayload) => deleteUser(payLoad),
    onSuccess: () => {
      toast.success("회원 탈퇴 성공");
      router.push("/");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password")!.toString();
    mutate({ password });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" variant={"destructive"} className="shrink-0">
          탈퇴
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>회원 탈퇴</DialogTitle>
          <DialogDescription>
            탈퇴 후에 모든 정보는 즉시 삭제됩니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="password"
            className="mt-2 hidden sm:block text-sm font-medium opacity-70"
          >
            파일 이름
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="패스워드를 입력해주세요"
            className="mt-2 p-4 w-full rounded border"
            required
            minLength={4}
          />

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant={"secondary"} className="shrink-0">
                닫기
              </Button>
            </DialogClose>
            <Button
              type="submit"
              variant={"destructive"}
              disabled={isPending}
              className="shrink w-full"
            >
              {isPending ? <Spinner /> : "회원 탈퇴"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
