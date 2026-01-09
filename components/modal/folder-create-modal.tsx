"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FolderPlus } from "lucide-react";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { safeAwait } from "@/lib/safe-await";
import Form from "next/form";
import { SubmitButton } from "../submit-button";
import { createFolderAction } from "@/actions/folder-action-client";

interface Props {
  folderId: string | null;
}

export function FolderCreateModal({ folderId }: Props) {
  const router = useRouter();
  const ref = useRef<HTMLButtonElement>(null);

  const onSubmit = async (formData: FormData) => {
    const name = formData.get("name")?.toString();

    if (!name) {
      toast.error("이름을 입력해주세요");
      return;
    }

    const [data, error] = await safeAwait(createFolderAction(name, folderId));

    if (error) {
      toast.error(error.message);
    }

    if (data) {
      toast.success("폴더 생성 성공");
      router.refresh();
      setTimeout(() => ref.current?.click(), 150);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <span className="text-base">폴더 생성</span>
          <FolderPlus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>폴더 생성</DialogTitle>
          <DialogDescription>현재 경로에 폴더를 추가합니다.</DialogDescription>
          <Form action={onSubmit}>
            <label
              htmlFor="name"
              className="mt-2 hidden sm:block text-sm font-medium opacity-70"
            >
              폴더명
            </label>
            <input
              id="name"
              name="name"
              placeholder="폴더명 입력해주세요"
              className="mt-2 p-4 w-full border rounded"
              required
              minLength={2}
            />
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button ref={ref} variant={"secondary"} className="shrink-0">
                  닫기
                </Button>
              </DialogClose>
              <SubmitButton className="shrink w-full" text="폴더 생성" />
            </DialogFooter>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
