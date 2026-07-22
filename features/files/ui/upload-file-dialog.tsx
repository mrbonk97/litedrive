"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Aperture } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

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
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/spinner";
import { cn } from "@/lib/utils";
import {
  completeFileUpload,
  markFileUploadFailed,
  prepareFileUpload,
} from "@/features/files/api/file-transfer.api";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const uploadFileSchema = z.object({
  files: z
    .array(
      z.custom<File>(
        (value) => typeof File !== "undefined" && value instanceof File,
        "올바른 파일을 선택해주세요.",
      ),
    )
    .min(1, "파일을 하나 이상 선택해주세요.")
    .refine(
      (files) => files.every((file) => file.size > 0),
      "빈 파일은 업로드할 수 없습니다.",
    )
    .refine(
      (files) => files.every((file) => file.size <= MAX_FILE_SIZE),
      "각 파일 크기는 최대 10MB까지 가능합니다.",
    ),
});

type UploadFileInput = z.infer<typeof uploadFileSchema>;

interface WorkerUploadResult {
  ok: boolean;
  error: string;
}

function sendFileToWorker(
  workerUrl: string,
  token: string,
  file: File,
  onProgress: (percent: number) => void,
): Promise<WorkerUploadResult> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();

    request.open("POST", workerUrl);
    request.setRequestHeader("Authorization", `Bearer ${token}`);
    request.setRequestHeader("Content-Type", "application/octet-stream");

    request.upload.addEventListener("progress", (event) => {
      const total = event.lengthComputable ? event.total : file.size;

      if (total <= 0) return;

      const percent = Math.min(100, Math.round((event.loaded / total) * 100));
      onProgress(percent);
    });

    request.addEventListener("load", () => {
      resolve({
        ok: request.status >= 200 && request.status < 300,
        error: request.responseText,
      });
    });
    request.addEventListener("error", () => {
      reject(new Error("파일 전송에 실패했습니다."));
    });
    request.addEventListener("abort", () => {
      reject(new Error("파일 전송이 취소되었습니다."));
    });

    request.send(file);
  });
}

interface Props {
  className?: string;
}

export function UploadFileDialog({ className }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<{
    current: number;
    total: number;
    fileName: string;
    percent: number;
  } | null>(null);

  const segments = pathname.split("/").filter(Boolean);
  const curFolderId = segments.length === 2 ? segments[1] : null;

  const form = useForm<UploadFileInput>({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: {
      files: [],
    },
  });

  async function onSubmit(data: UploadFileInput) {
    setIsUploading(true);
    const failedFiles: Array<{ name: string; error: string }> = [];
    let successCount = 0;

    try {
      for (const [index, file] of data.files.entries()) {
        setUploadProgress({
          current: index + 1,
          total: data.files.length,
          fileName: file.name,
          percent: Math.round((index / data.files.length) * 100),
        });

        let error: string | null;

        try {
          error = await uploadFile(file, (filePercent) => {
            const percent = Math.round(
              ((index + filePercent / 100) / data.files.length) * 100,
            );

            setUploadProgress({
              current: index + 1,
              total: data.files.length,
              fileName: file.name,
              percent,
            });
          });
        } catch (uploadError) {
          console.error(uploadError);
          error = "업로드 처리 중 오류가 발생했습니다.";
        }

        if (error) {
          failedFiles.push({ name: file.name, error });
        } else {
          successCount += 1;
        }

        setUploadProgress({
          current: index + 1,
          total: data.files.length,
          fileName: file.name,
          percent: Math.round(((index + 1) / data.files.length) * 100),
        });
      }

      if (failedFiles.length === 0) {
        toast.success(`${successCount}개 파일을 업로드했습니다.`);
      } else if (successCount === 0) {
        toast.error(
          `${failedFiles.length}개 파일 업로드에 실패했습니다. ${failedFiles[0].error}`,
        );
      } else {
        toast.warning(
          `${successCount}개 성공, ${failedFiles.length}개 실패했습니다. ${failedFiles[0].name}: ${failedFiles[0].error}`,
        );
      }

      form.reset();
      setOpen(false);
      router.refresh();
    } finally {
      setUploadProgress(null);
      setIsUploading(false);
    }
  }

  async function uploadFile(
    file: File,
    onProgress: (percent: number) => void,
  ): Promise<string | null> {
    const prepared = await prepareFileUpload({
      name: file.name,
      size: file.size,
      mimeType: file.type,
      folderId: curFolderId,
    });

    if (prepared.error || !prepared.data) {
      return prepared.error ?? "업로드 준비에 실패했습니다.";
    }

    let uploadResponse: WorkerUploadResult;

    try {
      uploadResponse = await sendFileToWorker(
        prepared.data.workerUrl,
        prepared.data.token,
        file,
        onProgress,
      );
    } catch (error) {
      await markFileUploadFailed(prepared.data.fileId);
      console.error(error);
      return "파일 전송에 실패했습니다.";
    }

    if (!uploadResponse.ok) {
      await markFileUploadFailed(prepared.data.fileId);
      return uploadResponse.error || "파일 전송에 실패했습니다.";
    }

    const completed = await completeFileUpload({
      fileId: prepared.data.fileId,
      storagePath: prepared.data.storagePath,
      folderId: curFolderId,
      name: file.name,
      size: file.size,
      mimeType: file.type,
    });

    if (completed.error) {
      return completed.error;
    }

    return null;
  }

  function handleOpenChange(nextOpen: boolean) {
    if (isUploading) return;
    setOpen(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className={cn("p-4 w-full", className)}>
          <Aperture size={24} className="pb-0.5" />
          파일 업로드
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>파일 업로드</DialogTitle>
          <DialogDescription>
            현재 경로에 파일을 추가합니다. 여러 파일은 한 개씩 순서대로
            업로드됩니다.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          id="upload-file-form"
          className="min-w-0"
        >
          <FieldGroup className="min-w-0">
            <Controller
              name="files"
              control={form.control}
              render={({ field: { onChange, ref, name }, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="min-w-0">
                  <FieldLabel htmlFor="files">파일</FieldLabel>

                  <input
                    id="files"
                    name={name}
                    ref={ref}
                    type="file"
                    multiple
                    disabled={isUploading}
                    onChange={(event) => {
                      onChange(Array.from(event.target.files ?? []));
                    }}
                    className="min-w-0 max-w-full p-4 w-full rounded-lg border text-sm cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground"
                  />

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}

                  {uploadProgress && (
                    <div className="grid min-w-0 max-w-full gap-2 overflow-hidden">
                      <div className="flex min-w-0 items-center justify-between gap-4 text-sm text-muted-foreground">
                        <p className="min-w-0 flex-1 truncate">
                          {uploadProgress.current}/{uploadProgress.total} 업로드
                          중: {uploadProgress.fileName}
                        </p>
                        <span className="shrink-0 font-medium text-foreground">
                          {uploadProgress.percent}%
                        </span>
                      </div>
                      <div
                        role="progressbar"
                        aria-label="파일 업로드 진행률"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={uploadProgress.percent}
                        className="h-2 w-full max-w-full overflow-hidden rounded-full bg-secondary"
                      >
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${uploadProgress.percent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isUploading} size="lg">
              닫기
            </Button>
          </DialogClose>

          <Button
            disabled={isUploading}
            type="submit"
            form="upload-file-form"
            size="lg"
          >
            {isUploading ? (
              <>
                <Spinner />
                {uploadProgress
                  ? `${uploadProgress.current}/${uploadProgress.total}`
                  : "준비 중"}
              </>
            ) : (
              "업로드"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
