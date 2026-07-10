import { Logo } from "@/components/logo";
import { getCurrentUser } from "@/features/auth/api/get-current-user.api";
import { SignUpForm } from "@/features/auth/ui/sign-up-form";
import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "회원가입",
  description: "LiteDrive 계정을 만들고 파일 보관과 공유를 시작하세요.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SignUpPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (user) {
    redirect("/folders");
  }

  return (
    <main className="p-4 h-svh block lg:flex flex-col items-center justify-center lg:bg-rose-50">
      <section className="p-4 lg:p-8 lg:max-w-md w-full rounded-lg bg-background lg:shadow-lg">
        <hgroup>
          <Logo />
          <h1 className="mt-4 text-4xl font-bold">회원가입</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            불필요한 개인정보 없이, 안전하고 간편하게 파일을 보관하세요.
          </p>
        </hgroup>
        <SignUpForm />
        <div className="lg:h-32" />
      </section>
      <p className="mt-4 px-4 text-sm text-center text-muted-foreground">
        계속 진행하면 Litedrive의{" "}
        <Link
          href="/policy"
          className="underline underline-offset-4 hover:text-primary"
        >
          이용약관
        </Link>
        과{" "}
        <Link
          href="/privacy"
          className="underline underline-offset-4 hover:text-primary"
        >
          개인정보 처리방침
        </Link>
        에 동의하는 것으로 간주됩니다.
      </p>
    </main>
  );
}
