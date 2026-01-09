"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { safeAwait } from "@/lib/safe-await";
import { SubmitButton } from "../submit-button";
import { FolderType } from "@/types";
import Form from "next/form";
import { updateFolderAction } from "@/actions/folder-action-client";

interface Props {
  folder: FolderType;
  isOpen: boolean;
  close: () => void;
}

export function FolderUpdateModal({ folder, isOpen, close }: Props) {
  const router = useRouter();

  const onSubmit = async (formData: FormData) => {
    const name = formData.get("name")?.toString();

    if (!name) {
      toast.error("이름을 입력해주세요");
      return;
    }

    const [data, error] = await safeAwait(
      updateFolderAction(folder.id, { name })
    );

    if (error) {
      toast.error(error.message);
    }

    if (data) {
      toast.success("폴더 생성 성공");
      router.refresh();
      setTimeout(() => close(), 150);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>폴더 이름 변경</DialogTitle>
          <DialogDescription>폴더 이름을 수정할 후 있습니다.</DialogDescription>
          <Form action={onSubmit}>
            <label
              htmlFor="name"
              className="mt-2 hidden sm:block text-sm font-medium opacity-70"
            >
              파일 이름
            </label>
            <input
              id="name"
              name="name"
              defaultValue={folder.name}
              placeholder="파일 이름을 입력해주세요"
              className="mt-2 p-4 w-full rounded border"
              minLength={2}
            />
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant={"secondary"} className="shrink-0">
                  닫기
                </Button>
              </DialogClose>
              <SubmitButton text="이름 변경" className="shrink w-full" />
            </DialogFooter>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
