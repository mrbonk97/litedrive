import * as z from "zod";

export const renameFileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "파일명을 입력해주세요")
    .max(72, "파일명을 72자 이하로 입력해주세요."),
});
