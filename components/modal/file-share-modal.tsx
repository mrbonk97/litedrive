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
import { Copy, Radio } from "lucide-react";
import { useState } from "react";
import { safeAwait } from "@/lib/safe-await";
import { shareFileById } from "@/services/file-service";

interface Props {
  file: FileType;
  isOpen: boolean;
  close: () => void;
}

export function FileShareModal({ file, isOpen, close }: Props) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    const [data, error] = await safeAwait(shareFileById(file.ID));

    if (error) {
      toast.error(error.message);
      setError(error.message);
    }

    if (data) {
      toast.success(data.message);
      router.refresh();
    }

    setIsSubmitting(false);
  };

  const handleCopy = async () => {
    if (!file.SHARE_CODE) return;

    await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/download?code=${file.SHARE_CODE}`);

    toast.success("클립보드에 복사하였습니다.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>파일 공유</DialogTitle>
          <DialogDescription>파일을 공유할 수 있습니다.</DialogDescription>

          {file?.SHARE_CODE ? (
            <div className="mt-16">
              <h2 className="font-semibold opacity-80">공유 주소</h2>
              <div className="mt-2.5 p-2 flex items-center justify-center rounded border">
                <p className="text-sm font-bold opacity-80 w-full">
                  {`${process.env.NEXT_PUBLIC_BASE_URL}/share?code=${file.SHARE_CODE}`}
                </p>
                <Button variant={"secondary"} className="p-2" onClick={handleCopy}>
                  <Copy />
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Radio className="mt-16 mx-auto text-rose-400" size={48} />
              <p className="mt-4 text-sm text-center">{file?.NAME}</p>
            </>
          )}
          <p className="text-sm font-medium text-destructive text-center">{error}</p>
          <DialogFooter className="mt-16">
            <Button variant={"secondary"} className="shrink-0" asChild>
              <DialogClose>닫기</DialogClose>
            </Button>
            <Button onClick={onSubmit} disabled={isSubmitting} className="shrink w-full">
              {isSubmitting ? <Spinner /> : file.SHARE_CODE ? "공유 중지" : "공유 하기"}
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
