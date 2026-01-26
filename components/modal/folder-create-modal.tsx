"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFolder } from "@/client/api/folder.api";
import { CreateFolderPayload } from "@/client/api/folder.type";
import { useFolder } from "@/hooks/use-folder";

export function FolderCreateModal() {
  const { folderId } = useFolder();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: (payLoad: CreateFolderPayload) => createFolder(payLoad),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folder", folderId] });
      toast.success("폴더를 생성했습니다.");
      setIsOpen(false);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")!.toString();
    mutate({ name: name, parentFolderId: folderId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => setIsOpen(o)}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <span className="text-base">폴더 생성</span>
          <FolderPlus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>폴더 생성</DialogTitle>
          <DialogDescription>현재 경로에 폴더를 추가합니다.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="name"
            className="hidden sm:block text-sm font-medium opacity-70"
          >
            폴더명
          </label>
          <input
            id="name"
            name="name"
            placeholder="폴더명 입력해주세요"
            className="mt-2 p-4 w-full border rounded"
            required
            minLength={2}
          />
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant={"secondary"} className="shrink-0">
                닫기
              </Button>
            </DialogClose>
            <Button className="shrink w-full">
              {isPending ? <Spinner /> : "폴더 생성"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
