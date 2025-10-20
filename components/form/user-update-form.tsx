"use client";

import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { UserDeleteModal } from "@/components/modal/user-delete-modal";
import { updateUserPassword } from "@/services/user-client";
import { safeAwait } from "@/lib/safe-await";
import { useState } from "react";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    oldPassword: z.string().trim().min(1, { error: "기존 패스워드를 입력해주세요" }),
    newPassword: z
      .string()
      .trim()
      .min(4, { error: "4 ~ 20자 사이로 입력해주세요" })
      .max(20, { error: "4 ~ 20자 사이로 입력해주세요" }),
    passwordConfirm: z.string().trim(),
  })
  .superRefine((data, ctx) => {
    const pw = data.newPassword ?? "";
    const pwc = data.passwordConfirm ?? "";

    if (pw !== pwc) {
      ctx.addIssue({
        code: "custom",
        path: ["passwordConfirm"],
        message: "비밀번호가 일치하지 않습니다",
      });
    }
  });

export function UserUpdateForm() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const [data, error] = await safeAwait(
      updateUserPassword(values.oldPassword, values.newPassword)
    );
    if (error) {
      toast.error(error.message);
      form.setError("root", { message: error.message });
    }

    if (data) {
      toast.success(data.message);
      setTimeout(() => router.push("/sign-out"), 150);
      form.reset();
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-2 space-y-4">
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">기존 비밀번호</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="password"
                    placeholder="기존 비밀번호를 입력해주세요"
                    className="p-4 rounded border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">새로운 비밀번호</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="password"
                    placeholder="새로운 비밀번호를 입력해주세요"
                    className="p-4 rounded border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passwordConfirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">비밀번호 확인</FormLabel>
                <FormControl>
                  <input
                    {...field}
                    type="password"
                    placeholder="비밀번호 확인"
                    className="p-4 rounded border"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button type="button" variant={"destructive"} onClick={() => setIsModalOpen(true)}>
              탈퇴
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting} className="shrink w-full">
              {form.formState.isSubmitting ? <Spinner /> : "비밀번호 수정"}
            </Button>
          </div>
          <p className="text-sm text-center text-destructive">
            {form.formState.errors.root?.message}
          </p>
        </form>
      </Form>
      <UserDeleteModal isOpen={isModalOpen} close={() => setIsModalOpen(false)} />
    </>
  );
}
