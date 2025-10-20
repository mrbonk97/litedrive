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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FileType } from "@/app/types";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { safeAwait } from "@/lib/safe-await";
import { updateFolderById } from "@/services/folder-client";

interface Props {
  folder: FileType;
  isOpen: boolean;
  close: () => void;
}

const formSchema = z.object({
  name: z
    .string()
    .min(2, { error: "2 ~ 50자 사이로 입력해주세요" })
    .max(50, { error: "2 ~ 50자 사이로 입력해주세요" }),
});

export function FolderUpdateModal({ folder, isOpen, close }: Props) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: folder.NAME ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const [data, error] = await safeAwait(
      updateFolderById(folder.ID, folder.PARENT_FOLDER_ID!, values.name)
    );

    if (error) {
      toast.error(error.message);
      form.setError("root", { message: error.message });
    }

    if (data) {
      toast.success(data.message);
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">파일 이름</FormLabel>
                    <FormControl>
                      <input
                        placeholder="파일 이름을 입력해주세요"
                        className="p-4 rounded border"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <p className="text-sm font-medium text-destructive text-center">
                {form.formState.errors.root?.message}
              </p>

              <DialogFooter>
                <Button
                  variant={"secondary"}
                  disabled={form.formState.isSubmitting}
                  className="shrink-0"
                  asChild
                >
                  <DialogClose>닫기</DialogClose>
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="shrink w-full"
                >
                  {form.formState.isSubmitting ? <Spinner /> : "이름 변경"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
