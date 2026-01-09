import { z } from "zod";
import { db } from "@/db/db";
import { and, eq } from "drizzle-orm";
import { files } from "@/db/schema";
import { toDrizzleSet } from "./service-utils";
import { patchFileSchema } from "@/schemas/file-schema";

export async function getFileById(userId: string, fileId: string) {
  const [file] = await db
    .select()
    .from(files)
    .where(and(eq(files.ownerId, userId), eq(files.id, fileId)));

  if (!file) {
    throw new Error("FILE NOT FOUND OR UNAUTHORIZED");
  }

  return file;
}

export async function postFile(
  userId: string,
  name: string,
  type: string,
  size: number,
  folderId: string | null
) {
  const [file] = await db
    .insert(files)
    .values({
      ownerId: userId,
      name: name,
      type: type,
      size: size,
      folderId: folderId,
    })
    .returning();

  if (!file) {
    throw new Error("FILE NOT FOUND OR UNAUTHORIZED");
  }

  return file;
}

export async function deleteFileById(userId: string, fileId: string) {
  const [file] = await db
    .delete(files)
    .where(and(eq(files.id, fileId), eq(files.ownerId, userId)))
    .returning();

  if (!file) {
    throw new Error("FILE NOT FOUND OR UNAUTHORIZED");
  }

  return file;
}

export async function patchFileById(
  userId: string,
  fileId: string,
  data: z.infer<typeof patchFileSchema>
) {
  const updateData = toDrizzleSet(data);

  const [file] = await db
    .update(files)
    .set({ ...updateData, updatedAt: new Date() })
    .where(and(eq(files.id, fileId), eq(files.ownerId, userId)))
    .returning();

  if (!file) {
    throw new Error("FILE NOT FOUND OR UNAUTHORIZED");
  }

  return file;
}

export async function getSharedFileById(fileId: string) {
  const [file] = await db
    .select()
    .from(files)
    .where(and(eq(files.id, fileId), eq(files.share, true)));

  if (!file) {
    throw new Error("FILE NOT FOUND OR UNAUTHORIZED");
  }

  return file;
}
