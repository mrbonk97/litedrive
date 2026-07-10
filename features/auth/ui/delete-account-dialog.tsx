"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundX } from "lucide-react";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
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
import { deleteAccountSchema } from "../schema/delete-account.schema";
import { deleteAccount } from "../api/delete-account.api";

export function DeleteAccountDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof deleteAccountSchema>>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof deleteAccountSchema>) {
    const result = await deleteAccount(data.password);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    toast.success("계정을 삭제하였습니다.");
    form.reset();
    setOpen(false);
    router.refresh();
    router.replace("/sign-in");
  }

  function handleOpenChange(nextOpen: boolean) {
    if (form.formState.isSubmitting) {
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
          <form id="delete-account-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup className="gap-4">
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="oldPassword"
                      className="sr-only text-sm font-medium"
                    >
                      패스워드
                    </FieldLabel>
                    <input
                      {...field}
                      type="password"
                      id="oldPassword"
                      aria-invalid={fieldState.invalid}
                      placeholder="패스워드를 입력해주세요"
                      className="p-4 rounded-lg border"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
          <AlertDialogFooter>
            <AlertDialogCancel size="lg" disabled={form.formState.isSubmitting}>
              취소
            </AlertDialogCancel>
            <Button
              size="lg"
              type="submit"
              form={"delete-account-form"}
              variant="destructive"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner /> : "탈퇴하기"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
