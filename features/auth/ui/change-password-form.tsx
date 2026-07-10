"use client";

import * as z from "zod";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { changePasswordSchema } from "@/features/auth/schema/change-password.schema";
import { changePassword } from "@/features/auth/api/change-password.api";
import { translateSupabaseError } from "@/lib/utils";

export function ChangePasswordForm() {
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof changePasswordSchema>) {
    const { error } = await changePassword(
      supabase,
      data.oldPassword,
      data.newPassword,
    );

    if (error) {
      toast.error(translateSupabaseError(error));
      return;
    }

    toast.success("패스워드를 변경하였습니다.");
    form.reset();
    router.refresh();
    router.replace("/sign-in");
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="col-span-4 lg:col-span-2 p-4 grid gap-4 rounded-lg border bg-card"
    >
      <header>
        <p className="text-sm text-muted-foreground">
          현재 비밀번호 확인 후 새 비밀번호로 변경할 수 있습니다.
        </p>
        <h2 className="mt-1 text-2xl font-semibold">비밀번호 변경 </h2>
      </header>

      <FieldGroup className="mt-4 gap-4">
        <Controller
          name="oldPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="oldPassword" className="text-sm font-medium">
                기존 패스워드
              </FieldLabel>
              <input
                {...field}
                type="password"
                id="oldPassword"
                aria-invalid={fieldState.invalid}
                placeholder="기존 패스워드를 입력해주세요"
                className="p-3 rounded-lg border"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="newPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="newPassword" className="text-sm font-medium">
                새로운 패스워드
              </FieldLabel>
              <input
                {...field}
                type="password"
                id="newPassword"
                aria-invalid={fieldState.invalid}
                placeholder="새로운 패스워드를 입력해주세요"
                className="p-3 rounded-lg border"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="confirmPassword"
                className="text-sm font-medium"
              >
                패스워드 확인
              </FieldLabel>
              <input
                {...field}
                type="password"
                id="confirmPassword"
                aria-invalid={fieldState.invalid}
                placeholder="패스워드 확인"
                className="p-3 rounded-lg border"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="mt-4 p-3 w-full"
          >
            {form.formState.isSubmitting ? <Spinner /> : "비밀번호 변경"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
