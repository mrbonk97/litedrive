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
import { Shredder } from "lucide-react";
import { FolderType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteFolder } from "@/client/api/folder.api";
import { DeleteFolderPayload } from "@/client/api/folder.type";
import { useFolder } from "@/hooks/use-folder";

interface Props {
  folder: FolderType;
  isOpen: boolean;
  close: () => void;
}

export function FolderDeleteModal({ folder, isOpen, close }: Props) {
  const { folderId } = useFolder();
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: (payLoad: DeleteFolderPayload) => deleteFolder(payLoad),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folder", folderId] });
      toast.success("폴더 삭제됨");
      close();
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>폴더 삭제</DialogTitle>
          <DialogDescription>폴더를 삭제할 수 있습니다.</DialogDescription>
        </DialogHeader>

        <Shredder className="mt-4 mx-auto text-destructive" size={48} />
        <p className="text-sm text-center">{folder.name}</p>

        <DialogFooter className="mt-4">
          <Button variant={"secondary"} className="shrink-0" asChild>
            <DialogClose>닫기</DialogClose>
          </Button>
          <Button
            onClick={() => mutate({ id: folder.id })}
            variant={"destructive"}
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
