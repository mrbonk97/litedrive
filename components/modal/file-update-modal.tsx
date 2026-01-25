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
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileType } from "@/types";
import { FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateFilePayload } from "@/client/api/file.type";
import { updateFile } from "@/client/api/file.api";
import { useFolder } from "@/hooks/use-folder";

interface Props {
  file: FileType;
  isOpen: boolean;
  close: () => void;
}

export function FileUpdateModal({ file, isOpen, close }: Props) {
  const { folderId } = useFolder();
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: (payLoad: UpdateFilePayload) => updateFile(payLoad),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folder", folderId] });
      toast.success("파일 수정됨");
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

    mutate({
      id: file.id,
      name: name,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>파일 이름 변경</DialogTitle>
          <DialogDescription>파일 이름을 수정할 후 있습니다.</DialogDescription>
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
            required
            minLength={2}
            defaultValue={file.name}
            placeholder="파일 이름을 입력해주세요"
            className="mt-2 p-4 w-full rounded border"
          />

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant={"secondary"} className="shrink-0">
                닫기
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="shrink w-full"
            >
              {isPending ? <Spinner /> : "이름 변경"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
