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
import { Shredder } from "lucide-react";
import { toast } from "sonner";
import { FileType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteFilePayload } from "@/client/api/file.type";
import { deleteFile } from "@/client/api/file.api";
import { useFolder } from "@/hooks/use-folder";

interface Props {
  file: FileType;
  isOpen: boolean;
  close: () => void;
}

export function FileDeleteModal({ file, isOpen, close }: Props) {
  const { folderId } = useFolder();
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: (payLoad: DeleteFilePayload) => deleteFile(payLoad),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folder", folderId] });
      toast.success("파일 삭제됨");
      close();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>파일 삭제</DialogTitle>
          <DialogDescription>파일을 삭제할 수 있습니다.</DialogDescription>
        </DialogHeader>

        <Shredder className="mt-4 mx-auto text-destructive" size={48} />
        <p className="text-sm text-center">{file.name}</p>

        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant={"secondary"} className="shrink-0">
              닫기
            </Button>
          </DialogClose>
          <Button
            variant={"destructive"}
            onClick={() => mutate({ id: file.id })}
            disabled={isPending}
            className="shrink w-full"
          >
            {isPending ? <Spinner /> : "삭제"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
