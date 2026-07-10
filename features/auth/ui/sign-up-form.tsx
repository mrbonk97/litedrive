"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { signUp } from "../api/sign-up.api";
import { signUpSchema } from "../schema/sign-up.schema";
import { AuthError } from "@supabase/supabase-js";
import { translateSupabaseError } from "@/lib/utils";

export function SignUpForm() {
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signUpSchema>) {
    try {
      await signUp(supabase, data.username, data.password);
      toast.success("회원가입에 성공했습니다.");
      router.refresh();
      router.replace("/folders");
    } catch (error) {
      if (error instanceof AuthError) {
        toast.error(translateSupabaseError(error));
        return;
      }

      toast.error(
        translateSupabaseError(error, "회원가입 중 오류가 발생했습니다."),
      );
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup className="mt-8 gap-3">
        <Controller
          name="username"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="form-signup-username"
                className="text-sm font-medium"
              >
                아이디
              </FieldLabel>

              <input
                {...field}
                id="form-signup-username"
                aria-invalid={fieldState.invalid}
                placeholder="litedrive123"
                autoComplete="username"
                className="p-3 rounded-lg border"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                htmlFor="form-signup-password"
                className="text-sm font-medium"
              >
                패스워드
              </FieldLabel>

              <input
                {...field}
                id="form-signup-password"
                aria-invalid={fieldState.invalid}
                placeholder="비밀번호를 입력하세요"
                autoComplete="new-password"
                type="password"
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
                htmlFor="form-signup-confirm-password"
                className="text-sm font-medium"
              >
                패스워드 확인
              </FieldLabel>

              <input
                {...field}
                id="form-signup-confirm-password"
                aria-invalid={fieldState.invalid}
                placeholder="비밀번호를 다시 입력하세요"
                autoComplete="new-password"
                type="password"
                className="p-3 rounded-lg border"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="mt-8 p-3 w-full"
      >
        {form.formState.isSubmitting ? "가입 중..." : "회원가입"}
      </Button>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        이미 계정이 있나요?{" "}
        <a
          href="/sign-in"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          로그인
        </a>
      </p>
    </form>
  );
}
