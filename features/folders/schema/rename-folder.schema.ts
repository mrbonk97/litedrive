import * as z from "zod";

export const renameFolderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "폴더명을 입력해주세요")
    .max(72, "폴더명을 72자 이하로 입력해주세요."),
});
