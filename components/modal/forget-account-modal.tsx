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
import { Button } from "@/components/ui/button";
import { Siren } from "lucide-react";

export function ForgotAccountModal() {
  return (
    <Dialog>
      <DialogTrigger className="hover:underline underline-offset-2">클릭</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>계정 분실 대응방법</DialogTitle>
          <DialogDescription>계정을 잊으셨나요? 걱정하지 마세요.</DialogDescription>
          <Siren className="mt-4 mx-auto text-rose-400" />

          <p className="mt-4 mx-auto max-w-96 font-medium opacity-80">
            저희는 사용자의 휴대폰 번호나 이메일 등 개인정보를 수집하지 않기 때문에, 계정을 직접 찾아드릴 수는 없습니다.
            <br /> 하지만 걱정하지 않으셔도 됩니다.
          </p>

          <p className="mt-4 mx-auto max-w-96 font-medium opacity-80">
            7일 동안 활동이 없는 계정은 자동으로 삭제됩니다.
          </p>

          <DialogFooter className="mt-16">
            <Button variant={"secondary"} className="w-full" asChild>
              <DialogClose>닫기</DialogClose>
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
