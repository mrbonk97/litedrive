import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export function LandingTopNav() {
  return (
    <nav className="border-b">
      <div className="p-4 h-16 mx-auto max-w-7xl flex items-center justify-between gap-4">
        <Logo />
        <div className="h-full flex gap-2">
          <Button className="py-1" asChild>
            <Link href="/sign-up">회원가입</Link>
          </Button>
          <Button variant="secondary" className="py-1" asChild>
            <Link href="/sign-in">로그인</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
