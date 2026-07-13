import Link from "next/link";
import { Metadata } from "next";
import { SignInForm } from "@/features/auth/ui/sign-in-form";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/features/auth/api/get-current-user.api";
import { redirect } from "next/navigation";
import { LogoIcon } from "@/components/logo-icon";

export const metadata: Metadata = {
  title: "로그인",
  description: "LiteDrive 계정에 로그인하여 파일과 폴더를 관리하세요.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SignInPage() {
  const supabase = await createClient();
  const user = await getCurrentUser(supabase);

  if (user) {
    redirect("/folders");
  }

  return (
    <main className="p-4 min-h-svh block lg:flex flex-col items-center justify-center lg:bg-rose-50">
      <section className="mt-4 lg:mt-0 lg:p-8 max-w-md w-full lg:rounded-lg lg:border bg-background">
        <LogoIcon size="sm" className="block mx-auto lg:mx-0 w-fit" />
        <h1 className="sr-only lg:not-sr-only lg:mt-4 text-2xl font-bold tracking-tight">
          로그인
        </h1>
        <SignInForm />
        <div className="lg:h-32" />
      </section>
      <p className="mt-4 max-w-md px-4 text-xs leading-5 text-center text-balance break-keep text-muted-foreground">
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
