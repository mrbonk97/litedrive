import { z } from "zod";

export const updateUserSchema = z.object({
  oldPassword: z.string().min(4),
  newPassword: z.string().min(4),
});

export const deleteUserSchema = z.object({
  password: z.string().min(4),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
