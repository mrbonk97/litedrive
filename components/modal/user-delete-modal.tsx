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
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { safeAwait } from "@/lib/safe-await";
import { deleteUser } from "@/services/user-client";

const formSchema = z.object({
  password: z.string().min(1, { error: "패스워드를 입력해주세요" }),
});

interface Props {
  isOpen: boolean;
  close: () => void;
}

export function UserDeleteModal({ isOpen, close }: Props) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const [data, error] = await safeAwait(deleteUser(values.password));

    if (error) {
      toast.error(error.message);
      form.setError("root", { message: error.message });
    }

    if (data) {
      toast.success(data.message);
      setTimeout(() => router.push("/bye"), 150);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>회원 탈퇴</DialogTitle>
          <DialogDescription>탈퇴 후에 모든 정보는 즉시 삭제됩니다.</DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>비밀번호</FormLabel>
                    <FormControl>
                      <input
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
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
              <DialogFooter className="mt-16">
                <Button variant={"secondary"} className="shrink-0" asChild>
                  <DialogClose type="button">닫기</DialogClose>
                </Button>
                <Button
                  type="submit"
                  variant={"destructive"}
                  disabled={form.formState.isSubmitting}
                  className="shrink w-full"
                >
                  {form.formState.isSubmitting ? <Spinner /> : "회원 탈퇴"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
