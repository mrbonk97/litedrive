"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import * as z from "zod";
import { FileType } from "@/types";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateFile } from "../api/update-file.api";
import { renameFileSchema } from "../schema/rename-file.schema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  file: FileType;
}

export function RenameFileDialog({ open, onOpenChange, file }: Props) {
  const router = useRouter();

  const form = useForm<z.infer<typeof renameFileSchema>>({
    resolver: zodResolver(renameFileSchema),
    defaultValues: {
      name: file.name,
    },
  });

  async function onSubmit(data: z.infer<typeof renameFileSchema>) {
    const nextName = data.name.trim();

    if (nextName === file.name) {
      toast.error("변경된 내용이 없습니다.");
      return;
    }

    try {
      await updateFile(file.id, { name: nextName });
      toast.success("파일 이름을 변경했습니다.");
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("파일 이름 변경에 실패했습니다.");
    }
  }

  useEffect(() => {
    if (open) {
      form.reset({ name: file.name });
    }
  }, [open, file.name, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>파일 이름 변경</DialogTitle>
          <DialogDescription>
            선택한 파일의 이름을 변경합니다.
          </DialogDescription>
        </DialogHeader>

        <form id="rename-file-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel
                    htmlFor="name"
                    className="sr-only text-sm font-medium"
                  >
                    파일명
                  </FieldLabel>

                  <input
                    {...field}
                    id="name"
                    aria-invalid={fieldState.invalid}
                    placeholder="파일명을 입력해주세요"
                    className="w-full rounded-lg border p-4"
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={form.formState.isSubmitting}
              size="lg"
            >
              닫기
            </Button>
          </DialogClose>

          <Button
            type="submit"
            form="rename-file-form"
            disabled={form.formState.isSubmitting}
            size="lg"
          >
            {form.formState.isSubmitting ? <Spinner /> : "변경"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
