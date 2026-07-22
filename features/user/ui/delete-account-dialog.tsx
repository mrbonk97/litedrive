"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { UserRoundX } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { deleteAccount } from "@/features/user/api/delete-account.api";

export function DeleteAccountDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAccount();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("계정을 삭제하였습니다.");
      setOpen(false);
      router.replace("/sign-in");
      router.refresh();
    });
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isPending) {
      return;
    }

    setOpen(nextOpen);
  }

  return (
    <div className="col-span-4 lg:col-span-2 p-4 h-fit rounded-lg border bg-card">
      <header>
        <p className="text-sm text-muted-foreground">
          계정을 영구적으로 삭제합니다.
        </p>
        <h2 className="mt-1 text-2xl font-semibold">회원탈퇴 </h2>
      </header>

      <UserRoundX size={32} className="my-16 mx-auto text-destructive" />
      <AlertDialog open={open} onOpenChange={handleOpenChange}>
        <AlertDialogTrigger asChild>
          <Button type="button" variant="destructive" className="p-3 w-full">
            회원탈퇴
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>회원탈퇴</AlertDialogTitle>
            <AlertDialogDescription className="text-balance">
              계정과 저장된 파일 정보가 삭제됩니다. 다시 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel size="lg" disabled={isPending}>
              취소
            </AlertDialogCancel>
            <Button
              size="lg"
              type="button"
              variant="destructive"
              disabled={isPending}
              onClick={handleDelete}
            >
              {isPending ? <Spinner /> : "탈퇴하기"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
