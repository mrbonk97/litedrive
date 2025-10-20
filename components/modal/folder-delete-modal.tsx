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
import { useRouter } from "next/navigation";
import { FileType } from "@/app/types";
import { toast } from "sonner";
import { Shredder } from "lucide-react";
import { useState } from "react";
import { deleteFolderById } from "@/services/folder-client";
import { safeAwait } from "@/lib/safe-await";

interface Props {
  folder: FileType;
  isOpen: boolean;
  close: () => void;
}

export function FolderDeleteModal({ folder, isOpen, close }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    const [data, error] = await safeAwait(deleteFolderById(folder.ID));

    if (error) {
      toast.error(error.message);
      setError(error.message);
    }

    if (data) {
      toast.success(data.message);
      router.refresh();
      setTimeout(() => close(), 150);
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>폴더 삭제</DialogTitle>
          <DialogDescription>폴더를 삭제할 수 있습니다.</DialogDescription>

          <Shredder className="mt-16 mx-auto text-destructive" size={48} />
          <p className="mt-4 text-sm text-center">{folder.NAME}</p>
          <p className="text-sm font-medium text-destructive text-center">{error}</p>

          <DialogFooter className="mt-16">
            <Button variant={"secondary"} className="shrink-0" asChild>
              <DialogClose>닫기</DialogClose>
            </Button>
            <Button
              onClick={onSubmit}
              variant={"destructive"}
              disabled={isSubmitting}
              className="shrink w-full"
            >
              {isSubmitting ? <Spinner /> : "삭제"}
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
