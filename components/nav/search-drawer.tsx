"use client";

import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Search } from "lucide-react";

export function SearchDrawer() {
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const preservedSearchParams = useMemo(() => {
    return Array.from(searchParams.entries()).filter(([key]) => key !== "q");
  }, [searchParams]);

  useEffect(() => {
    if (!open) return;

    const id = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => window.clearTimeout(id);
  }, [open]);

  return (
    <Drawer direction="top" open={open} onOpenChange={setOpen}>
      <DrawerTrigger className="cursor-pointer lg:hidden">
        <Search className="p-1.5 h-8 w-8 stroke-rose-400" />
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-left">검색</DrawerTitle>
          <DrawerDescription className="text-left">
            파일 또는 폴더를 검색합니다.
          </DrawerDescription>
        </DrawerHeader>

        <Form
          action="/folders"
          className="relative w-full px-4"
          onSubmit={() => setOpen(false)}
        >
          {preservedSearchParams.map(([key, value], index) => (
            <input
              key={`${key}-${value}-${index}`}
              type="hidden"
              name={key}
              value={value}
            />
          ))}

          <button
            type="submit"
            className="absolute left-7 top-1/2 rounded-lg p-2 text-muted-foreground -translate-y-1/2 bg-secondary cursor-pointer"
          >
            <Search size={20} />
          </button>

          <input
            ref={inputRef}
            name="q"
            placeholder="파일 또는 폴더 검색"
            className="w-full rounded-lg border p-4 pl-14"
          />
        </Form>
        <DrawerFooter />
      </DrawerContent>
    </Drawer>
  );
}
