"use client";

import Form from "next/form";
import Link from "next/link";
import { safeAwait } from "@/lib/safe-await";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SubmitButton } from "../submit-button";
import { signUpAction } from "@/actions/auth-action-client";

export function SignUpForm() {
  const router = useRouter();

  const onSubmit = async (formData: FormData) => {
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();
    const passwordConfirm = formData.get("passwordConfirm")?.toString();

    if (!username || !password || !passwordConfirm) {
      toast.error("아이디와 비밀번호를 입력해주세요");
      return;
    }

    if (password !== passwordConfirm) {
      toast.error("비밀번호가 일치하지 않습니다");
      return;
    }

    const [, error] = await safeAwait(signUpAction(username, password));

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("회원가입 성공");
    setTimeout(() => {
      router.push("/folders");
    }, 150);
  };

  return (
    <Form
      action={onSubmit}
      className="mt-8 sm:mt-16 mx-auto max-w-xl w-full space-y-2"
    >
      <h1 className="hidden sm:block text-2xl font-bold opacity-80">
        회원가입
      </h1>

      <label
        htmlFor="username"
        className="mt-4 block text-sm font-medium opacity-70"
      >
        아이디
      </label>
      <input
        id="username"
        name="username"
        placeholder="username"
        className="p-4 border rounded w-full"
        autoCapitalize="none"
        autoCorrect="off"
        required
        minLength={4}
      />

      <label
        htmlFor="password"
        className="mt-2 block text-sm font-medium opacity-70"
      >
        패스워드
      </label>
      <input
        id="password"
        name="password"
        type="password"
        placeholder="* * * * * * * *"
        className="p-4 border rounded w-full"
        required
        minLength={4}
      />

      <label
        htmlFor="passwordConfirm"
        className="mt-2 block text-sm font-medium opacity-70"
      >
        패스워드 확인
      </label>
      <input
        id="passwordConfirm"
        name="passwordConfirm"
        type="password"
        placeholder="* * * * * * * *"
        className="p-4 border rounded w-full"
        required
        minLength={4}
      />

      <SubmitButton text="회원가입" className="mt-16 sm:mt-24 w-full" />

      <p className="mt-4 text-xs text-center opacity-70">
        이미 계정이 있으시다면{" "}
        <Link href="/sign-in" className="hover:underline underline-offset-2">
          로그인
        </Link>
      </p>
    </Form>
  );
}
