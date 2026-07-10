"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash } from "lucide-react";

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
import { Spinner } from "@/components/spinner";
import { FileType } from "@/types";

import { deleteFile } from "../api/delete-files.api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileType;
}

export function DeleteFileDialog({ open, onOpenChange, file }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    if (isDeleting) return;

    setIsDeleting(true);

    try {
      const result = await deleteFile(file.id);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("파일을 삭제하였습니다.");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("파일 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isDeleting) return;
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>파일 삭제</DialogTitle>
          <DialogDescription>
            `{file.name}` 파일을 영구적으로 삭제합니다.
          </DialogDescription>
        </DialogHeader>

        <Trash
          size={32}
          aria-hidden="true"
          className="mx-auto mt-8 mb-4 text-destructive"
        />

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
