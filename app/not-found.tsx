import { Logo } from "@/components/nav/logo";
import { Bird } from "lucide-react";
import Link from "next/link";

function NotFoundPage() {
  return (
    <main className="p-4">
      <Logo />
      <h1 className="mt-16 text-2xl font-bold text-center text-rose-400">
        페이지를 찾을 수 없습니다.
      </h1>
      <Bird size={128} className="mt-8 mx-auto text-rose-400" />
      <Link href={"/"} className="mt-8 block mx-auto w-fit hover:underline underline-offset-2">
        처음화면으로 이동
      </Link>
    </main>
  );
}

export default NotFoundPage;
