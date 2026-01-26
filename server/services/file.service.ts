import { db } from "@/db/db";
import { and, eq } from "drizzle-orm";
import { files } from "@/db/schema";
import { ErrorCode } from "@/lib/handle-error";
import { UpdateFileInput, UploadFileInput } from "@/server/schemas/file.schema";

export async function getFileById(userId: string, fileId: string) {
  const [file] = await db
    .select()
    .from(files)
    .where(and(eq(files.ownerId, userId), eq(files.id, fileId)));

  if (!file) {
    throw new Error(ErrorCode.UNAUTHORIZED);
  }

  return file;
}

export async function uploadFile(userId: string, input: UploadFileInput) {
  const [file] = await db
    .insert(files)
    .values({
      ownerId: userId,
      name: input.name,
      type: input.type,
      size: input.size,
      folderId: input.folderId,
    })
    .returning();

  if (!file) {
    throw new Error(ErrorCode.UNAUTHORIZED);
  }

  return file;
}

export async function deleteFileById(userId: string, fileId: string) {
  const [file] = await db
    .delete(files)
    .where(and(eq(files.id, fileId), eq(files.ownerId, userId)))
    .returning();

  if (!file) {
    throw new Error(ErrorCode.UNAUTHORIZED);
  }

  return file;
}

export async function updateFile(
  userId: string,
  fileId: string,
  input: UpdateFileInput,
) {
  const updateData = Object.fromEntries(
    Object.entries(input).filter(([, v]) => v !== undefined),
  );

  const [file] = await db
    .update(files)
    .set({ ...updateData, updatedAt: new Date() })
    .where(and(eq(files.id, fileId), eq(files.ownerId, userId)))
    .returning();

  if (!file) {
    throw new Error(ErrorCode.UNAUTHORIZED);
  }

  return file;
}

export async function getSharedFileById(fileId: string) {
  const [file] = await db
    .select()
    .from(files)
    .where(and(eq(files.id, fileId), eq(files.share, true)));

  if (!file) {
    throw new Error(ErrorCode.UNAUTHORIZED);
  }

  return file;
}
