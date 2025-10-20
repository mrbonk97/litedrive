import { Logo } from "@/components/nav/logo";
import { Sparkle } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "회원탈퇴 - LiteDrive",
};

async function ByePage() {
  return (
    <main className="p-4">
      <Logo />
      <header className="mt-28 mx-auto max-w-4xl">
        <h1 className="text-4xl text-center font-bold text-rose-400">회원탈퇴 완료</h1>
        <h2 className="mt-4 text text-center font-medium text-rose-400">
          모든 데이터는 완벽하게 삭제되어 절대 복구가 불가능합니다.
        </h2>
        <Sparkle className="mt-16 mx-auto text-rose-400" size={64} />
        <div className="mt-16">
          <Link href={"/"} className="block w-fit mx-auto hover:underline underline-offset-2">
            처음화면으로 이동
          </Link>
        </div>
      </header>
    </main>
  );
}

export default ByePage;
