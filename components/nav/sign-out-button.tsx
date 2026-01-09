"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { safeAwait } from "@/lib/safe-await";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { signOutAction } from "@/actions/auth-action-client";

export function SignOutButton() {
  const router = useRouter();

  const handleClick = async () => {
    const [data, error] = await safeAwait(signOutAction());
    if (error) {
      toast.error(error.message);
    }

    if (data) {
      toast.success(data.message);
      setTimeout(() => router.push("/sign-out"), 150);
    }
  };

  return (
    <DropdownMenuItem onClick={handleClick} className="cursor-pointer">
      로그아웃
    </DropdownMenuItem>
  );
}
