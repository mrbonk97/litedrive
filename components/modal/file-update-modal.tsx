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
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { safeAwait } from "@/lib/safe-await";
import { updateFileAction } from "@/actions/file-action-client";
import { SubmitButton } from "../submit-button";
import { FileType } from "@/types";
import Form from "next/form";

interface Props {
  file: FileType;
  isOpen: boolean;
  close: () => void;
}

export function FileUpdateModal({ file, isOpen, close }: Props) {
  const router = useRouter();

  const onSubmit = async (formData: FormData) => {
    const name = formData.get("name")?.toString();

    if (!name) {
      toast.error("이름을 입력해주세요");
      return;
    }

    const [data, error] = await safeAwait(updateFileAction(file.id, { name }));

    if (error) {
      toast.error(error.message);
    }

    if (data) {
      toast.success("수정 완료");
      router.refresh();
      setTimeout(() => close(), 150);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>파일 이름 변경</DialogTitle>
          <DialogDescription>파일 이름을 수정할 후 있습니다.</DialogDescription>
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
              required
              minLength={2}
              defaultValue={file.name}
              placeholder="파일 이름을 입력해주세요"
              className="mt-2 p-4 w-full rounded border"
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
