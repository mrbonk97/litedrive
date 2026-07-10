"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";

import { FolderType } from "@/types";

import { renameFolder } from "../api/rename-folder.api";
import { renameFolderSchema } from "../schema/rename-folder.schema";

interface Props {
  open: boolean;
  onOpenChange: () => void;
  folder: FolderType;
}

export function RenameFolderDialog({ open, onOpenChange, folder }: Props) {
  const router = useRouter();

  const form = useForm<z.infer<typeof renameFolderSchema>>({
    resolver: zodResolver(renameFolderSchema),
    defaultValues: {
      name: folder.name,
    },
  });

  async function onSubmit(data: z.infer<typeof renameFolderSchema>) {
    try {
      await renameFolder(folder.id, data.name);
      toast.success("폴더 이름을 변경했습니다.");
      onOpenChange();
      router.refresh();
    } catch {
      toast.error("폴더 이름 변경에 실패했습니다.");
    }
  }

  React.useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, folder.name, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>폴더 이름 변경</DialogTitle>
          <DialogDescription>
            선택한 폴더의 이름을 변경합니다.
          </DialogDescription>
        </DialogHeader>

        <form id="rename-folder-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                    폴더명
                  </FieldLabel>

                  <input
                    {...field}
                    id="name"
                    aria-invalid={fieldState.invalid}
                    placeholder="폴더명을 입력해주세요"
                    className="p-3 rounded-lg border"
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
            form="rename-folder-form"
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
