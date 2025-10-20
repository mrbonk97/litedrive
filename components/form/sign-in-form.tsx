"use client";

import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { toast } from "sonner";
import { signIn } from "@/services/user-client";
import { safeAwait } from "@/lib/safe-await";

const formSchema = z.object({
  username: z
    .string()
    .min(4, { error: "4 ~ 20자 사이로 입력해주세요" })
    .max(20, { error: "4 ~ 20자 사이로 입력해주세요" }),
  password: z
    .string()
    .min(4, { error: "4 ~ 20자 사이로 입력해주세요" })
    .max(20, { error: "4 ~ 20자 사이로 입력해주세요" }),
});

export function SignInForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const [data, error] = await safeAwait(signIn(values.username, values.password));

    if (error) {
      toast.error(error.message);
      form.setError("root", { message: error.message });
    }

    if (data) {
      toast.success(data.message);
      setTimeout(() => router.push("/folders"), 150);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-4 sm:mt-0 px-4 shrink w-full sm:max-w-xs space-y-8 sm:space-y-4"
      >
        <h1 className="hidden sm:block text-2xl font-bold opacity-70">로그인</h1>
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
            <FormItem className="mt-4">
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
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full">
          {form.formState.isSubmitting ? <Spinner /> : "로그인"}
        </Button>
        <p className="text-xs text-center opacity-70">
          아직 계정이 없으시다면{" "}
          <Link href={"/sign-up"} className="hover:underline underline-offset-2">
            회원가입
          </Link>
        </p>
        <p className="text-sm font-medium text-destructive text-center">
          {form.formState.errors.root?.message}
        </p>
      </form>
    </Form>
  );
}
