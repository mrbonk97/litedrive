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
import { Copy, Radio } from "lucide-react";
import { useState } from "react";
import { safeAwait } from "@/lib/safe-await";
import { updateFileAction } from "@/actions/file-action-client";
import { FileType } from "@/types";

interface Props {
  file: FileType;
  isOpen: boolean;
  close: () => void;
}

export function FileShareModal({ file, isOpen, close }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);

    const [data, error] = await safeAwait(
      updateFileAction(file.id, { share: !file.share })
    );

    if (error) {
      toast.error(error.message);
    }

    if (data) {
      toast.success(data.message);
      router.refresh();
    }

    setIsSubmitting(false);
  };

  const handleCopy = async () => {
    if (!file.share) return;

    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_BASE_URL}/download?code=${file.id}`
    );

    toast.success("클립보드에 복사하였습니다.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>파일 공유</DialogTitle>
          <DialogDescription>파일을 공유할 수 있습니다.</DialogDescription>

          {file.share ? (
            <div className="mt-16">
              <div className="hidden sm:block mt-2 text-sm font-medium opacity-70">
                다운로드 링크
              </div>
              <div className="mt-2.5 p-2 flex items-center justify-center rounded border">
                <p className="text-xs font-bold opacity-80 w-full">
                  {`${process.env.NEXT_PUBLIC_BASE_URL}/download?code=${file.id}`}
                </p>
                <Button
                  variant={"secondary"}
                  className="p-2"
                  onClick={handleCopy}
                >
                  <Copy />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Radio className="mt-16 mx-auto text-rose-400" size={48} />
              <p className="mt-2 text-sm text-center">{file.name}</p>
            </>
          )}

          <DialogFooter className="mt-16">
            <Button variant={"secondary"} className="shrink-0" asChild>
              <DialogClose>닫기</DialogClose>
            </Button>
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="shrink w-full"
            >
              {isSubmitting ? (
                <Spinner />
              ) : file.share ? (
                "공유 중지"
              ) : (
                "공유 하기"
              )}
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
