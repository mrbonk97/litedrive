"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { Spinner } from "../spinner";
import { useState } from "react";

export function ProfileButton() {
  const router = useRouter();
  const supabase = createClient();

  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    if (isSigningOut) return;

    setIsSigningOut(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      toast.error("로그아웃에 실패했습니다.");
      setIsSigningOut(false);
      return;
    }

    toast.success("로그아웃되었습니다.");

    router.refresh();
    router.replace("/sign-in");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hidden lg:block p-2 cursor-pointer rounded-full bg-rose-100">
        <User size={20} className="stroke-rose-400" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>계정</DropdownMenuLabel>

          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/profile">프로필</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={isSigningOut}
            onClick={handleSignOut}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            {isSigningOut ? <Spinner /> : "로그아웃"}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
