import * as z from "zod";

export const signInSchema = z.object({
  username: z
    .string()
    .trim()
    .min(4, "아이디는 4 ~ 24 글자 사이어야 합니다.")
    .max(24, "아이디는 4 ~ 24 글자 사이어야 합니다.")
    .regex(
      /^[a-zA-Z0-9_.]+$/,
      "아이디는 영문, 숫자, 밑줄, 점만 사용할 수 있습니다.",
    ),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8글자 이상이어야 합니다.")
    .max(128, "비밀번호는 최대 128글자까지 가능합니다."),
});

export type SignInInput = z.infer<typeof signInSchema>;
