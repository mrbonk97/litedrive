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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { toast } from "sonner";
import { FolderPlus } from "lucide-react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { safeAwait } from "@/lib/safe-await";
import { createFolder } from "@/services/folder-client";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { error: "2 ~ 50자 사이로 입력해주세요" })
    .max(50, { error: "2 ~ 50자 사이로 입력해주세요" }),
});

interface Props {
  folderId: number;
}

export function FolderCreateModal({ folderId }: Props) {
  const router = useRouter();
  const ref = useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const [data, error] = await safeAwait(createFolder(values.name, folderId));

    if (error) {
      toast.error(error.message);
      form.setError("root", { message: error.message });
    }

    if (data) {
      toast.success("폴더 생성 성공");
      router.refresh();
      setTimeout(() => ref.current?.click(), 150);
    }
  };

  return (
    <Dialog
      onOpenChange={(next) => {
        if (next) form.reset();
      }}
    >
      <Button className="w-full" asChild>
        <DialogTrigger>
          <span className="text-base">폴더 생성</span>
          <FolderPlus />
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>폴더 생성</DialogTitle>
          <DialogDescription>현재 경로에 폴더를 추가합니다.</DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">폴더명</FormLabel>
                    <FormControl>
                      <input
                        placeholder="폴더명을 입력해주세요"
                        className="p-4 border rounded"
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
                  <DialogClose ref={ref}>닫기</DialogClose>
                </Button>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="shrink w-full"
                >
                  {form.formState.isSubmitting ? <Spinner /> : "폴더 생성"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
