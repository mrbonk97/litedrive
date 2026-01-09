"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Aperture, CloudUpload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { toast } from "sonner";
import { formatSize } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { safeAwait } from "@/lib/safe-await";
import { useRef, useState } from "react";
import { uploadFileAction } from "@/actions/file-action-client";
import { useFiles } from "@/hooks/use-file";

interface Props {
  folderId: string | null;
}

export function FileUploadModal({ folderId }: Props) {
  const router = useRouter();
  const ref = useRef<HTMLButtonElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { files, handleAdd, handleDrop, removeFile, reset } = useFiles();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
      const [, error] = await safeAwait(uploadFileAction(file, folderId));

      if (error) {
        failCount++;
        continue;
      }

      successCount++;
    }

    setIsSubmitting(false);
    router.refresh();
    if (successCount === 0) {
      toast.error("업로드 실패");
    } else if (failCount > 0) {
      toast.error(`업로드 완료: ${successCount}개 완료, ${failCount}개 실패`);
    } else {
      toast.success(`${successCount}개 파일 업로드 완료`);
    }

    setTimeout(() => ref.current?.click(), 150);
  };

  return (
    <Dialog
      onOpenChange={(next) => {
        if (next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full">
          <span className="text-base">파일 업로드</span> <Aperture />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>파일 업로드</DialogTitle>
          <DialogDescription>현재 경로에 파일을 추가합니다.</DialogDescription>
        </DialogHeader>
        <label
          htmlFor="files"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="h-40 flex flex-col items-center justify-center gap-2 text-rose-400 rounded-lg border-dashed border-rose-400 border-2 hover:opacity-80 hover:bg-secondary cursor-pointer"
        >
          <CloudUpload size={36} />
          <p className="text-sm font-medium">클릭해서 파일을 추가하세요</p>
          <p className="text-xs font-medium opacity-70">
            최대용량: 10MB (각 파일)
          </p>
        </label>
        <input id="files" type="file" multiple hidden onChange={handleAdd} />

        <ul className="max-h-48 space-y-2 overflow-y-auto">
          {files.map((file) => (
            <li
              key={file.name}
              className="p-2 text-sm grid grid-cols-12 items-center bg-secondary rounded"
            >
              <div className="col-span-8 truncate">{file.name}</div>
              <div className="col-span-3 ml-auto">{formatSize(file.size)}</div>
              <button
                onClick={() => removeFile(file)}
                className="col-span-1 ml-auto cursor-pointer hover:opacity-80 duration-150"
              >
                <X size={16} opacity={0.5} />
              </button>
            </li>
          ))}
        </ul>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              ref={ref}
              disabled={isSubmitting}
              variant={"secondary"}
              className="shrink-0"
            >
              닫기
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="shrink w-full"
          >
            {isSubmitting ? <Spinner /> : "업로드"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
