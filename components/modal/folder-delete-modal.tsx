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
import { toast } from "sonner";
import { Shredder } from "lucide-react";
import { useState } from "react";
import { safeAwait } from "@/lib/safe-await";
import { FolderType } from "@/types";
import { deleteFolderAction } from "@/actions/folder-action-client";

interface Props {
  folder: FolderType;
  isOpen: boolean;
  close: () => void;
}

export function FolderDeleteModal({ folder, isOpen, close }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    const [data, error] = await safeAwait(deleteFolderAction(folder.id));

    if (error) {
      toast.error(error.message);
    }

    if (data) {
      toast.success("삭제 완료");
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
          <p className="mt-4 text-sm text-center">{folder.name}</p>

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
