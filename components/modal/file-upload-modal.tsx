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
import { useRef, useState } from "react";
import { useFiles } from "@/hooks/use-file";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFile, uploadFile } from "@/client/api/file.api";
import { useFolder } from "@/hooks/use-folder";
import { uploadToR2 } from "@/client/api/r2.api";

export function FileUploadModal() {
  const { folderId } = useFolder();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { files, handleAdd, handleDrop, removeFile, reset } = useFiles();

  const result = useRef({ success: 0, fail: 0 });

  const { mutateAsync } = useMutation({
    mutationFn: async ({
      folderId,
      file,
    }: {
      folderId: string;
      file: File;
    }) => {
      const { file: createdFile, token } = await uploadFile({
        folderId: folderId,
        name: file.name,
        size: file.size,
        type: file.type,
      });

      try {
        await uploadToR2({ token: token, file: file });
        await updateFile({ id: createdFile.id, uploadStatus: "success" });
      } catch (err) {
        await updateFile({ id: createdFile.id, uploadStatus: "failed" });
        throw err;
      }
    },
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    result.current = { success: 0, fail: 0 };

    const results = await Promise.allSettled(
      files.map((file) => mutateAsync({ folderId: folderId, file: file }))
    );

    results.forEach((res) => {
      if (res.status === "fulfilled") {
        result.current.success++;
      } else {
        result.current.fail++;
      }
    });

    setIsSubmitting(false);

    const { success, fail } = result.current;

    if (success === 0) {
      toast.error("업로드 실패");
    } else if (fail > 0) {
      toast.error(`업로드 완료: ${success}개 성공, ${fail}개 실패`);
    } else {
      toast.success(`${success}개 파일 업로드 완료`);
    }

    queryClient.invalidateQueries({ queryKey: ["folder", folderId] });
    reset();
    setIsOpen(false);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(next) => {
        if (next) reset();
        setIsOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <Button className="w-full">
          <span className="text-base">파일 업로드</span>
          <Aperture />
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
          className="h-32 flex flex-col items-center justify-center gap-2 text-rose-400 rounded border-dashed border-rose-400 border-2 hover:opacity-80 hover:bg-secondary cursor-pointer"
        >
          <CloudUpload size={36} />
          <p className="text-sm font-medium">클릭해서 파일을 추가하세요</p>
          <p className="text-xs font-medium opacity-70">
            최대용량: 10MB (각 파일)
          </p>
        </label>
        <input id="files" type="file" multiple hidden onChange={handleAdd} />

        {files.length > 0 && (
          <ul className="max-h-48 space-y-2 overflow-y-auto">
            {files.map((file) => (
              <li
                key={`${file.name}-${file.lastModified}`}
                className="p-2 text-sm grid grid-cols-12 items-center bg-secondary rounded"
              >
                <div className="col-span-8 truncate">{file.name}</div>
                <div className="col-span-3 ml-auto">
                  {formatSize(file.size)}
                </div>
                <button
                  onClick={() => removeFile(file)}
                  disabled={isSubmitting}
                  className="col-span-1 ml-auto hover:opacity-80 duration-150"
                >
                  <X size={16} opacity={0.5} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={isSubmitting}
              variant="secondary"
              className="shrink-0"
            >
              닫기
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || files.length === 0}
            className="shrink w-full"
          >
            {isSubmitting ? <Spinner /> : "업로드"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
