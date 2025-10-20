"use client";

import Link from "next/link";
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
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Spinner } from "../spinner";
import { toast } from "sonner";
import { signIn, signUp } from "@/services/user-client";
import { safeAwait } from "@/lib/safe-await";

const formSchema = z
  .object({
    username: z
      .string()
      .min(4, { error: "4 ~ 20자 사이로 입력해주세요" })
      .max(20, { error: "4 ~ 20자 사이로 입력해주세요" }),
    password: z
      .string()
      .min(4, { error: "4 ~ 20자 사이로 입력해주세요" })
      .max(20, { error: "4 ~ 20자 사이로 입력해주세요" }),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

export function SignUpForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // 1. 회원가입
    const [data1, error1] = await safeAwait(signUp(values.username, values.password));

    if (error1) {
      toast.error(error1.message);
      form.setError("root", { message: error1.message });
      return;
    }

    // 2. 로그인
    const [data2, error2] = await safeAwait(signIn(values.username, values.password));

    if (error2) {
      toast.error(error2.message);
      form.setError("root", { message: error2.message });
      return;
    }

    if (data2) {
      toast.success(data1.message);
      setTimeout(() => router.push("/folders"), 150);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 sm:mt-0 px-4 shrink w-full sm:max-w-xs space-y-8 sm:space-y-4"
      >
        <h1 className="hidden sm:block text-2xl font-bold opacity-70">회원가입</h1>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>아이디</FormLabel>
              <FormControl>
                <input placeholder="username" className="p-4 sm:p-2 border-b" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <input
                  placeholder="* * * * * * * *"
                  type="password"
                  className="p-4 sm:p-2 border-b"
                  {...field}
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
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <input
                  placeholder="* * * * * * * *"
                  type="password"
                  className="p-4 sm:p-2 border-b"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? <Spinner /> : "회원가입"}
        </Button>

        <p className="text-xs text-center opacity-70">
          이미 계정이 있으시다면{" "}
          <Link href={"/sign-in"} className="hover:underline underline-offset-2">
            로그인
          </Link>
        </p>

        <p className="text-sm font-medium text-destructive text-center">
          {form.formState.errors.root?.message}
        </p>
      </form>
    </Form>
  );
}
