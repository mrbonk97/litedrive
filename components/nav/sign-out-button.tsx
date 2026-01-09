"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { safeAwait } from "@/lib/safe-await";
import { signOutAction } from "@/actions/auth-action-server";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function SignOutButton() {
  const router = useRouter();

  const handleClick = async () => {
    const [, error] = await safeAwait(signOutAction());
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("로그아웃 완료");
    setTimeout(() => router.push("/sign-out"), 150);
  };

  return (
    <DropdownMenuItem onClick={handleClick} className="cursor-pointer">
      로그아웃
    </DropdownMenuItem>
  );
}
