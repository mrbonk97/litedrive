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
import { Copy, Radio } from "lucide-react";
import { FileType } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UpdateFilePayload } from "@/client/api/file.type";
import { updateFile } from "@/client/api/file.api";
import { useFolder } from "@/hooks/use-folder";

interface Props {
  file: FileType;
  isOpen: boolean;
  close: () => void;
}

export function FileShareModal({ file, isOpen, close }: Props) {
  const { folderId } = useFolder();
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: (payLoad: UpdateFilePayload) => updateFile(payLoad),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folder", folderId] });
      toast.success("파일 공유상태 변경됨");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleClick = () => {
    mutate({
      id: file.id,
      share: !file.share,
    });
  };

  const handleCopy = async () => {
    if (!file.share) return;

    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_BASE_URL}/download?code=${file.id}`,
    );

    toast.success("클립보드에 복사하였습니다.");
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>파일 공유</DialogTitle>
          <DialogDescription>파일을 공유할 수 있습니다.</DialogDescription>
        </DialogHeader>

        {file.share ? (
          <div>
            <div className="hidden sm:block text-sm font-medium opacity-70">
              다운로드 링크
            </div>
            <div className="mt-2 p-2 flex items-center justify-center rounded border">
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
            <Radio className="mt-4 mx-auto text-rose-400" size={48} />
            <p className="text-sm text-center">{file.name}</p>
          </>
        )}

        <DialogFooter className="mt-4">
          <Button variant={"secondary"} className="shrink-0" asChild>
            <DialogClose>닫기</DialogClose>
          </Button>
          <Button
            onClick={() => handleClick()}
            disabled={isPending}
            className="shrink w-full"
          >
            {isPending ? <Spinner /> : file.share ? "공유 중지" : "공유 하기"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
