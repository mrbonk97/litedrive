import * as z from "zod";

export const updatePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(8, "비밀번호는 최소 8글자 이상이어야 합니다.")
      .max(128, "비밀번호는 최대 128글자까지 가능합니다."),
    newPassword: z
      .string()
      .min(8, "비밀번호는 최소 8글자 이상이어야 합니다.")
      .max(128, "비밀번호는 최대 128글자까지 가능합니다."),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요."),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["confirmPassword"],
  });
