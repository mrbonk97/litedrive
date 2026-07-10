"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Copy, Link2Off, Share2 } from "lucide-react";

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
import { changeShareFile } from "../api/change-share-file.api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileType;
}

export function ShareFileDialog({ open, onOpenChange, file }: Props) {
  const router = useRouter();

  const origin = useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );
  const [isLoading, setIsLoading] = useState(false);
  const canShare = file.upload_status === "success";

  async function changeShareState() {
    if (isLoading || !canShare) return;

    setIsLoading(true);

    try {
      await changeShareFile(file.id, file.is_shared);
      toast.success("공유 상태를 변경했습니다.");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("파일 공유 설정 변경에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCopyShareUrl() {
    try {
      await navigator.clipboard.writeText(
        `${origin}/download?code=${file.share_token}`,
      );
      toast.success("공유 링크를 복사했습니다.");
    } catch (error) {
      console.error(error);
      toast.error("공유 링크 복사에 실패했습니다.");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isLoading) return;
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>파일 공유</DialogTitle>
          <DialogDescription>
            `{file.name}` 파일의 공유 상태를 변경합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 rounded-lg border p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">공유 상태</p>
              <p className="mt-2 text-xs text-muted-foreground text-balance break-keep">
                {file.is_shared
                  ? "링크가 있는 모든 사용자가 접근할 수 있습니다."
                  : !canShare
                    ? "업로드가 완료된 파일만 공유할 수 있습니다."
                  : "현재 이 파일은 공유되지 않고 있습니다."}
              </p>
            </div>

            <div className="shrink-0 h-fit rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm">
              {file.is_shared ? "공유 중" : "비공유"}
            </div>
          </div>

          {file.is_shared && file.share_token && (
            <div className="mt-4">
              <label htmlFor="share-url" className="text-sm font-medium">
                공유 링크
              </label>

              <div className="mt-2 flex items-center gap-2">
                <input
                  id="share-url"
                  readOnly
                  value={`${origin}/download?code=${file.share_token}`}
                  className="h-10 w-full rounded-md border bg-background px-4 text-sm outline-none"
                />

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={isLoading}
                  onClick={handleCopyShareUrl}
                  aria-label="공유 링크 복사"
                >
                  <Copy size={16} aria-hidden="true" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={isLoading}
            >
              닫기
            </Button>
          </DialogClose>

          <Button
            type="button"
            size="lg"
            variant={file.is_shared ? "destructive" : "default"}
            disabled={isLoading || !canShare}
            onClick={changeShareState}
            className="w-full shrink"
          >
            {isLoading && <Spinner />}
            {!isLoading && file.is_shared && (
              <>
                <Link2Off size={16} aria-hidden="true" />
                공유 해제
              </>
            )}
            {!isLoading && !file.is_shared && (
              <>
                <Share2 size={16} aria-hidden="true" />
                공유 링크 생성
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
