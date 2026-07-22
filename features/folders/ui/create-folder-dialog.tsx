"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FolderPlus } from "lucide-react";
import { toast } from "sonner";
import z from "zod";

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

import { createFolder } from "../api/create-folder.api";
import { createFolderSchema } from "../schema/create-folder.schema";

interface Props {
  className?: string;
}

export function CreateFolderDialog({ className }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);

  const segments = pathname.split("/").filter(Boolean);
  const curFolderId = segments.length === 2 ? segments[1] : null;

  const form = useForm<z.infer<typeof createFolderSchema>>({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: z.infer<typeof createFolderSchema>) {
    try {
      await createFolder(data.name, curFolderId ?? null);
      toast.success("폴더를 생성했습니다.");
      form.reset();
      setOpen(false);
      router.refresh();
    } catch {
      toast.error("폴더 생성에 실패했습니다.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={cn("p-4 w-full", className)}>
          <FolderPlus size={24} className="pb-0.5" />
          폴더 생성
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>폴더 생성</DialogTitle>
          <DialogDescription>현재 경로에 폴더를 생성합니다.</DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} id="create-folder-form">
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
              size={"lg"}
            >
              닫기
            </Button>
          </DialogClose>

          <Button
            type="submit"
            form="create-folder-form"
            size={"lg"}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? <Spinner /> : "생성"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
