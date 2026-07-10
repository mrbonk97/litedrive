import type { User } from "@supabase/supabase-js";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { Logo } from "@/components/logo";
import { ProfileButton } from "@/components/nav/profile-button";

interface Props {
  user: User | null;
}

export function UserTopNav({ user }: Props) {
  return (
    <nav className="border-b">
      <div className="p-4 h-16 mx-auto max-w-5xl flex items-center justify-between gap-4">
        <Logo />
        {user ? (
          <ProfileButton />
        ) : (
          <Link
            href="/sign-in"
            aria-label="로그인"
            className="p-2 rounded-full bg-rose-100"
          >
            <LogIn className="stroke-rose-400" size={20} />
          </Link>
        )}
      </div>
    </nav>
  );
}
