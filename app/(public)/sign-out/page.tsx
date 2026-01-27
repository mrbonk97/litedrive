import { Logo } from "@/components/nav/logo";
import { Sparkle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "로그아웃 - LiteDrive",
};

async function SignOutPage() {
  return (
    <main className="p-4">
      <Logo />
      <header className="mt-28 mx-auto max-w-4xl">
        <h1 className="text-4xl text-center font-bold text-rose-400">
          안전하게 로그아웃 완료
        </h1>
        <Sparkle className="mt-16 mx-auto text-rose-400" size={64} />
        <div className="mt-16">
          <Link
            href={"/"}
            className="block w-fit mx-auto hover:underline underline-offset-2"
          >
            처음화면으로 이동
          </Link>
        </div>
      </header>
    </main>
  );
}

export default SignOutPage;
