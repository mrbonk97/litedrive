"use client";

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
import { Search } from "lucide-react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SearchButton() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const q = fd.get("q")?.toString().trim();

    if (!q) return; // 빈 검색어 방지

    router.push(`/folders?q=${encodeURIComponent(q)}`);
    setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <Drawer
      direction="top"
      open={isOpen}
      onOpenChange={(open) => setIsOpen(open)}
    >
      <DrawerTrigger className="lg:hidden p-1 h-8 w-8 rounded-full">
        <Search className="text-rose-400" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-left">검색</DrawerTitle>
          <DrawerDescription className="text-left">
            파일을 검색합니다.
          </DrawerDescription>
        </DrawerHeader>
        <form onSubmit={onSubmit} className="p-4 relative">
          <button className="absolute top-1/2 left-6 -translate-y-1/2">
            <Search className="text-rose-400" />
          </button>
          <input
            name="q"
            className="pl-12 p-4 w-full border-b"
            placeholder="검색어를 입력해주세요"
          />
        </form>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant={"secondary"}>닫기</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
