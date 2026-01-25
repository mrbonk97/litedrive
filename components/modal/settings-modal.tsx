"use client";

import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function SettingsModal() {
  const { theme, setTheme } = useTheme();

  return (
    <Dialog>
      <DialogTrigger
        className={`p-2 w-full flex items-center justify-end gap-2 rounded text-rose-400 hover:bg-sidebar-accent cursor-pointer`}
      >
        <span className="text-sm font-medium">설정</span>
        <Settings size={18} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>설정</DialogTitle>
          <DialogDescription>시스템 설정</DialogDescription>
        </DialogHeader>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
              {theme === "light" && "라이트 모드"}
              {theme === "dark" && "다크 모드"}
              {theme === "system" && "시스템 기본"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              라이트 모드
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              다크 모드
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              시스템 기본
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant={"secondary"} className="w-full">
              닫기
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
