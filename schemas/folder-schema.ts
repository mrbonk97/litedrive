import { z } from "zod";

export const patchFolderSchema = z.object({
  name: z.string().nullable().optional(),
  parentFolderId: z.string().nullable().optional(),
});

export const postFolderSchema = z.object({
  name: z.string().min(2).max(64),
  parentFolderId: z.string().min(2).nullable().optional(),
});
