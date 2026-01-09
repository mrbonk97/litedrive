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
import { Shredder } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { FileType } from "@/types";
import { safeAwait } from "@/lib/safe-await";
import { deleteFileAction } from "@/actions/file-action-client";

interface Props {
  file: FileType;
  isOpen: boolean;
  close: () => void;
}

export function FileDeleteModal({ file, isOpen, close }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    const [, error] = await safeAwait(deleteFileAction(file.id));

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("삭제 완료");
    router.refresh();
    setIsSubmitting(false);
    setTimeout(() => close(), 150);
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>파일 삭제</DialogTitle>
          <DialogDescription>파일을 삭제할 수 있습니다.</DialogDescription>

          <Shredder className="mt-16 mx-auto text-destructive" size={48} />
          <p className="mt-2 text-sm text-center">{file.name}</p>

          <DialogFooter className="mt-16">
            <DialogClose asChild>
              <Button variant={"secondary"} className="shrink-0">
                닫기
              </Button>
            </DialogClose>

            <Button
              variant={"destructive"}
              onClick={onSubmit}
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
