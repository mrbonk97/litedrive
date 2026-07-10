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
  file: z
    .custom<File>(
      (value) => typeof File !== "undefined" && value instanceof File,
      "파일을 선택해주세요.",
    )
    .refine((file) => file.size > 0, "빈 파일은 업로드할 수 없습니다.")
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "파일 크기는 최대 10MB까지 가능합니다.",
    ),
});

type UploadFileInput = z.infer<typeof uploadFileSchema>;

interface Props {
  className?: string;
}

export function UploadFileDialog({ className }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const segments = pathname.split("/").filter(Boolean);
  const curFolderId = segments.length === 2 ? segments[1] : null;

  const form = useForm<UploadFileInput>({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: {
      file: undefined,
    },
  });

  async function onSubmit(data: UploadFileInput) {
    setIsUploading(true);

    const file = data.file;

    try {
      const prepared = await prepareFileUpload({
        name: file.name,
        size: file.size,
        mimeType: file.type,
        folderId: curFolderId,
      });

      if (prepared.error || !prepared.data) {
        toast.error(prepared.error ?? "업로드 준비에 실패했습니다.");
        return;
      }

      let uploadResponse: Response;

      try {
        uploadResponse = await fetch(prepared.data.workerUrl, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${prepared.data.token}`,
            "Content-Type": "application/octet-stream",
          },
          body: file,
        });
      } catch (error) {
        await markFileUploadFailed(prepared.data.fileId);

        console.error(error);
        toast.error("파일 업로드에 실패했습니다.");
        router.refresh();
        return;
      }

      if (!uploadResponse.ok) {
        await markFileUploadFailed(prepared.data.fileId);

        toast.error(await uploadResponse.text());
        router.refresh();
        return;
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
        toast.error(completed.error);
        router.refresh();
        return;
      }

      toast.success("파일을 업로드 하였습니다.");
      form.reset();
      setOpen(false);
      router.refresh();
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={cn("p-4 w-full", className)}>
          <Aperture size={24} className="pb-0.5" />
          파일 업로드
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>파일 업로드</DialogTitle>
          <DialogDescription>현재 경로에 파일을 추가합니다.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} id="upload-file-form">
          <FieldGroup>
            <Controller
              name="file"
              control={form.control}
              render={({ field: { onChange, ref, name }, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="file">파일</FieldLabel>

                  <input
                    id="file"
                    name={name}
                    ref={ref}
                    type="file"
                    disabled={isUploading}
                    onChange={(event) => {
                      onChange(event.target.files?.[0]);
                    }}
                    className="p-4 w-full rounded-lg border text-sm cursor-pointer file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground"
                  />

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
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
            {isUploading ? <Spinner /> : "업로드"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
