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
import Form from "next/form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { safeAwait } from "@/lib/safe-await";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/submit-button";
import { deleteUserAction } from "@/actions/user-action-client";

export function UserDeleteModal() {
  const router = useRouter();

  const onSubmit = async (formData: FormData) => {
    const password = formData.get("password")?.toString();

    if (!password) {
      toast.error("패스워드를 입력해주세요");
      return;
    }

    const [, error] = await safeAwait(deleteUserAction(password));

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("회원탈퇴 완료");
    setTimeout(() => router.push("/bye"), 150);
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
          <Form action={onSubmit}>
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
                <Button
                  type="button"
                  variant={"secondary"}
                  className="shrink-0"
                >
                  닫기
                </Button>
              </DialogClose>
              <SubmitButton
                text="회원 탈퇴"
                className="shrink w-full"
                varient="destructive"
              />
            </DialogFooter>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
