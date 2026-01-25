"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FolderType } from "@/types";
import { FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateFolderPayload } from "@/client/api/folder.type";
import { updateFolder } from "@/client/api/folder.api";
import { Spinner } from "../spinner";
import { useFolder } from "@/hooks/use-folder";

interface Props {
  folder: FolderType;
  isOpen: boolean;
  close: () => void;
}

export function FolderUpdateModal({ folder, isOpen, close }: Props) {
  const { folderId } = useFolder();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (payLoad: UpdateFolderPayload) => updateFolder(payLoad),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folder", folderId] });
      toast.success("폴더 수정됨");
      close();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")!.toString();
    mutate({ id: folder.id, name: name });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>폴더 이름 변경</DialogTitle>
          <DialogDescription>폴더 이름을 수정할 후 있습니다.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="name"
            className="mt-2 hidden sm:block text-sm font-medium opacity-70"
          >
            파일 이름
          </label>
          <input
            id="name"
            name="name"
            defaultValue={folder.name}
            placeholder="파일 이름을 입력해주세요"
            className="mt-2 p-4 w-full rounded border"
            minLength={2}
          />
          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant={"secondary"} className="shrink-0">
                닫기
              </Button>
            </DialogClose>
            <Button className="shrink w-full">
              {isPending ? <Spinner /> : "이름 변경"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
