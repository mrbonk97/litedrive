import * as z from "zod";

export const deleteAccountSchema = z.object({
  password: z
    .string()
    .min(8, "비밀번호는 최소 8글자 이상이어야 합니다.")
    .max(128, "비밀번호는 최대 128글자까지 가능합니다."),
});
