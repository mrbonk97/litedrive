"use client";

import Link from "next/link";
import { Bug } from "lucide-react";
import { Logo } from "@/components/logo";

export default function GlobalError() {
  return (
    <main className="p-4 md:p-8 mx-auto max-w-5xl">
      <Logo />
      <header className="mt-16">
        <h1 className="text-4xl md:text-6xl font-bold text-rose-400">
          예상치 못한 오류가 발생했습니다
        </h1>
        <Bug className="mt-8 text-rose-400" size={64} />
        <div className="mt-8 p-4 md:p-8 rounded-lg bg-secondary text-sm whitespace-pre-line">
          요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.
        </div>
        <div className="mt-8">
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
