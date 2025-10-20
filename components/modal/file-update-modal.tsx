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
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FileType } from "@/app/types";
import { toast } from "sonner";
import { safeAwait } from "@/lib/safe-await";
import { updateFileById } from "@/services/file-service";

interface Props {
  file: FileType;
  isOpen: boolean;
  close: () => void;
}

const formSchema = z.object({
  name: z
    .string()
    .min(2, { error: "2 ~ 50자 사이로 입력해주세요" })
    .max(50, { error: "2 ~ 50자 사이로 입력해주세요" }),
});

export function FileUpdateModal({ file, isOpen, close }: Props) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: file.NAME,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const [data, error] = await safeAwait(updateFileById(file.ID, values.name, file.FOLDER_ID!));

    if (error) {
      toast.error(error.message);
      form.setError("root", { message: error.message });
      return;
    }

    if (data) {
      toast.success(data.message);
      router.refresh();
      close();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => close()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>파일 이름 변경</DialogTitle>
          <DialogDescription>파일 이름을 수정할 후 있습니다.</DialogDescription>
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
                <Button variant={"secondary"} className="shrink-0" asChild>
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
