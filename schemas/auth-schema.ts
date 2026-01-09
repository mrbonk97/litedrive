import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(4),
  password: z.string().min(4),
});

export const updateUserSchema = z.object({
  oldPassword: z.string().min(4),
  newPassword: z.string().min(4),
});

export const deleteUserSchema = z.object({
  password: z.string().min(4),
});
