import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(4),
});

export const signUpSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(4),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
