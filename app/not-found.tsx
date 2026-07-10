import { Logo } from "@/components/logo";
import { Bird } from "lucide-react";
import Link from "next/link";

function NotFoundPage() {
  return (
    <main className="p-4 md:p-8 mx-auto max-w-5xl">
      <Logo />
      <header className="mt-16">
        <h1 className="text-4xl md:text-6xl font-bold text-rose-400">
          페이지를 찾을 수 없습니다.
        </h1>
      </header>
      <Bird size={64} className="mt-8 mx-auto text-rose-400" />
      <Link
        href={"/"}
        className="mt-32 block w-fit mx-auto hover:underline underline-offset-2"
      >
        처음화면으로 이동
      </Link>
    </main>
  );
}

export default NotFoundPage;
