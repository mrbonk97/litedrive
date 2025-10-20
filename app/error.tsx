"use client";

import Link from "next/link";
import { Bug } from "lucide-react";
import { Logo } from "@/components/nav/logo";

interface Props {
  error: Error;
}

export default function GlobalError({ error }: Props) {
  return (
    <main className="p-4">
      <Logo />
      <header className="mt-28 mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-rose-400">예상치 못한 오류가 발생했습니다</h1>
        <Bug className="mt-16 text-rose-400" size={64} />
        <pre className="mt-8 p-4 bg-secondary rounded text-sm">
          오류: {error instanceof Error ? error.message : JSON.stringify(error)}
        </pre>
        <div className="mt-8">
          <Link href={"/"} className="block w-fit mx-auto hover:underline underline-offset-2">
            처음화면으로 이동
          </Link>
        </div>
      </header>
    </main>
  );
}
