"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signOut } from "@/client/api/auth.api";

export function SignOutButton() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      toast.success("로그아웃 성공");
      queryClient.clear();
      router.push("/sign-out");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <DropdownMenuItem onClick={() => mutate()} className="cursor-pointer">
      로그아웃
    </DropdownMenuItem>
  );
}
