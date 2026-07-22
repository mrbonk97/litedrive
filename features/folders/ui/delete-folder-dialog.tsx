"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FolderType } from "@/types";
import { Spinner } from "@/components/spinner";
import { Trash } from "lucide-react";
import { deleteFolder } from "../api/delete-folder.api";

interface Props {
  open: boolean;
  onOpenChange: () => void;
  folder: FolderType;
}

export function DeleteFolderDialog({ open, onOpenChange, folder }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await deleteFolder(folder.id);
      toast.success("폴더가 삭제되었습니다.");
      onOpenChange();
      router.refresh();
    } catch {
      toast.error("폴더 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>폴더 삭제</DialogTitle>
          <DialogDescription>
            `{folder.name}` 폴더를 영구적으로 삭제합니다.
          </DialogDescription>
        </DialogHeader>
        <Trash size={32} className="mx-auto my-8 stroke-destructive" />

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" size="lg" disabled={isDeleting}>
              닫기
            </Button>
          </DialogClose>

          <Button
            variant="destructive"
            size="lg"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner /> : "삭제"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
