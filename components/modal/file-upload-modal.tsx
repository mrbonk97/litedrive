"use client";

import { ChangeEvent, useRef, useState } from "react";
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
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { toast } from "sonner";
import { convertByte } from "@/lib/utils";
import { safeAwait } from "@/lib/safe-await";
import { uploadFileToFolder } from "@/services/folder-client";

interface Props {
  folderId: number;
}

const MAX_TOTAL_SIZE = 4 * 1024 * 1024;

export function FileUploadModal({ folderId }: Props) {
  const router = useRouter();
  const ref = useRef<HTMLButtonElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const _files = Array.from(e.target.files);

    // 파일 중 하나라도 20MB 초과하면 에러
    const isSizeOver = _files.some((file) => file.size > MAX_TOTAL_SIZE);

    if (isSizeOver) {
      toast.error("파일의 용량이 4MB를 초과했습니다.");
      return;
    }

    setFiles(_files);
  };

  const handleDelete = (name: string) => {
    setFiles((cur) => cur.filter((file) => file.name !== name));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    let successCount = 0;
    let failCount = 0;

    for (const file of files) {
      const [data, error] = await safeAwait(uploadFileToFolder(folderId, file));
      if (data) successCount++;
      if (error) failCount++;
    }

    setIsSubmitting(false);
    router.refresh();

    if (failCount > 0) {
      toast.error(`업로드 완료: ${successCount}개 성공, ${failCount}개 실패`);
    } else {
      toast.success(`${successCount}개 파일 업로드 성공`);
    }

    setTimeout(() => ref.current?.click(), 150);
  };

  return (
    <Dialog
      onOpenChange={(next) => {
        if (next) setFiles([]);
      }}
    >
      <Button className="w-full" asChild>
        <DialogTrigger>
          <span className="text-base">파일 업로드</span> <Aperture />
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>파일 업로드</DialogTitle>
          <DialogDescription>현재 경로에 파일을 추가합니다.</DialogDescription>
        </DialogHeader>
        <label
          htmlFor="files"
          className="h-40 flex flex-col items-center justify-center gap-2 text-rose-400 rounded-lg border-dashed border-rose-400 border-2 hover:opacity-80 hover:bg-secondary cursor-pointer"
        >
          <CloudUpload size={36} />
          <p className="text-sm font-medium">클릭해서 파일을 추가하세요</p>
          <p className="text-xs font-medium opacity-70">최대용량: 4MB (각 파일)</p>
        </label>
        <input id="files" type="file" multiple hidden onChange={handleChange} />
        <ul className="max-h-80 space-y-2 overflow-y-auto">
          {files.map((file) => (
            <li key={file.name} className="p-2 text-sm grid grid-cols-12 items-center bg-secondary rounded">
              <div className="col-span-8 truncate">{file.name}</div>
              <div className="col-span-3 ml-auto">{convertByte(file.size)}</div>
              <button
                className="col-span-1 ml-auto hover:opacity-80 duration-150"
                onClick={() => handleDelete(file.name)}
              >
                <X size={16} opacity={0.5} />
              </button>
            </li>
          ))}
        </ul>
        <DialogFooter>
          <Button variant={"secondary"} className="shrink-0" asChild>
            <DialogClose disabled={isSubmitting} ref={ref}>
              닫기
            </DialogClose>
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting} className="shrink w-full">
            {isSubmitting ? <Spinner /> : "업로드"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
