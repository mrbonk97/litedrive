"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings2, User } from "lucide-react";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { createClient } from "@/lib/supabase/client";
import { UploadFileDialog } from "@/features/files/ui/upload-file-dialog";
import { CreateFolderDialog } from "@/features/folders/ui/create-folder-dialog";
import { useState } from "react";

export function MenuButton() {
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
    <Drawer>
      <DrawerTrigger className="cursor-pointer lg:hidden">
        <Settings2 className="p-1.5 h-8 w-8 rounded-full bg-rose-100 stroke-rose-400" />
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-left">메뉴</DrawerTitle>
          <DrawerDescription className="text-left">
            지금 필요한 작업을 바로 실행하세요.
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 grid grid-cols-2 gap-4">
          <UploadFileDialog className="col-span-2" />
          <CreateFolderDialog className="col-span-2" />
          <DrawerClose asChild>
            <Link
              href="/profile"
              className="min-h-16 p-4 font-medium rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center flex-col gap-1"
            >
              <User size={24} />
              <span>프로필</span>
            </Link>
          </DrawerClose>

          <button
            type="button"
            disabled={isSigningOut}
            onClick={handleSignOut}
            className="min-h-16 p-4 font-medium rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center flex-col gap-1"
          >
            {isSigningOut ? (
              <Spinner />
            ) : (
              <>
                <LogOut size={24} />
                <span>로그아웃</span>
              </>
            )}
          </button>
        </div>

        <DrawerFooter className="px-4 pt-0 pb-4">
          <DrawerClose asChild>
            <Button type="button" variant="secondary" className="p-4">
              닫기
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
