"use client";

import Form from "next/form";
import Link from "next/link";
import { ForgotAccountModal } from "../modal/forget-account-modal";
import { safeAwait } from "@/lib/safe-await";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SubmitButton } from "../submit-button";
import { signInAction } from "@/actions/auth-action-client";

export function SignInForm() {
  const router = useRouter();

  const onSubmit = async (formData: FormData) => {
    const username = formData.get("username")?.toString();
    const password = formData.get("password")?.toString();

    if (!username || !password) {
      toast.error("아이디와 비밀번호를 입력해주세요");
      return;
    }

    const [, error] = await safeAwait(signInAction(username, password));

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("로그인 성공");
    setTimeout(() => {
      router.push("/folders");
    }, 150);
  };

  return (
    <Form
      action={onSubmit}
      className="mt-8 sm:mt-16 mx-auto max-w-xl w-full space-y-2"
    >
      <h1 className="hidden sm:block text-2xl font-bold opacity-80">로그인</h1>

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

      <SubmitButton text="로그인" className="mt-16 sm:mt-24 w-full" />

      <p className="mt-4 text-xs text-center opacity-70">
        아직 계정이 없으시다면{" "}
        <Link href="/sign-up" className="hover:underline underline-offset-2">
          회원가입
        </Link>
      </p>

      <p className="mt-2 text-xs text-center opacity-70">
        계정을 잊어버리셨다면 <ForgotAccountModal />
      </p>
    </Form>
  );
}
