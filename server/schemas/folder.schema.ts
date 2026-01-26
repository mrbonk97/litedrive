import { z } from "zod";

export const createFolderSchema = z.object({
  name: z.string().min(2).max(64),
  parentFolderId: z.string().min(2).nullable(),
});

export const updateFolderSchema = z.object({
  name: z.string().optional(),
  parentFolderId: z.string().nullable().optional(),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type UpdateFolderInput = z.infer<typeof updateFolderSchema>;
