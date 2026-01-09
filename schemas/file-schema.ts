import { z } from "zod";

export const postFileSchema = z.object({
  name: z.string().min(2).max(128),
  size: z.number(),
  type: z.string().max(64),
  folderId: z.string().min(2).max(128).nullable(),
});

export const patchFileSchema = z.object({
  name: z.string().min(2).max(128).optional(),
  folderId: z.string().min(2).max(128).optional().nullable(),
  share: z.boolean().optional(),
  uploadStatus: z.enum(["success", "failed"]).optional(),
});
