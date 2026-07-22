"use client";

import * as z from "zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/lib/supabase/client";
import { signInSchema } from "../schema/sign-in.schema";
import { signIn } from "../api/sign-in.api";
import { AuthError } from "@supabase/supabase-js";
import { Spinner } from "@/components/spinner";
import { translateSupabaseError } from "@/lib/utils";

export function SignInForm() {
  const router = useRouter();
  const supabase = createClient();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof signInSchema>) {
    try {
      await signIn(supabase, data.username, data.password);
      toast.success("로그인 했습니다.");
      router.refresh();
      router.replace("/folders");
    } catch (error) {
      if (error instanceof AuthError) {
        toast.error(translateSupabaseError(error));
        return;
      }

      toast.error(
        translateSupabaseError(error, "로그인 중 오류가 발생했습니다."),
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
                placeholder="litedrive12"
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
      </FieldGroup>

      <Button
        type="submit"
        disabled={form.formState.isSubmitting}
        className="mt-8 p-3 w-full"
      >
        {form.formState.isSubmitting ? <Spinner /> : "로그인"}
      </Button>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        아직 계정이 없나요?{" "}
        <a
          href="/sign-up"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          회원가입
        </a>
      </p>
    </form>
  );
}
