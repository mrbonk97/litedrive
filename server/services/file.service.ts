import { db } from "@/db/db";
import { and, eq, sql } from "drizzle-orm";
import { files } from "@/db/schema";
import { ErrorCode } from "@/lib/handle-error";
import { CreateFileInput, UpdateFileInput } from "@/server/schemas/file.schema";
import { NeonDbError } from "@neondatabase/serverless";

export async function getFileById(userId: string, fileId: string) {
  const [file] = await db
    .select()
    .from(files)
    .where(
      and(
        eq(files.ownerId, userId),
        eq(files.id, fileId),
        eq(files.uploadStatus, "success")
      )
    );

  if (!file) {
    throw new Error(ErrorCode.UNAUTHORIZED);
  }

  return file;
}

export async function createFile(userId: string, input: CreateFileInput) {
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
  input: UpdateFileInput
) {
  const updateData = Object.fromEntries(
    Object.entries(input).filter(([, v]) => v !== undefined)
  );

  // share가 true면 DB에서 랜덤 share_code 생성
  if (input.share === true) {
    updateData.shareCode =
      sql`SUBSTRING(ENCODE(gen_random_bytes(4), 'hex') FROM 1 FOR 8)` as any;
  }

  if (input.share === false) {
    updateData.shareCode = null;
  }

  try {
    const [file] = await db
      .update(files)
      .set({ ...updateData, updatedAt: new Date() })
      .where(and(eq(files.id, fileId), eq(files.ownerId, userId)))
      .returning();

    if (!file) {
      throw new Error(ErrorCode.UNAUTHORIZED);
    }

    return file;
  } catch (err) {
    // UNIQUE 충돌 시 재시도
    if (
      err instanceof Error &&
      err.cause instanceof NeonDbError &&
      err.cause.code === "23505" &&
      input.share
    ) {
      return updateFile(userId, fileId, input);
    }
    throw err;
  }
}

export async function getSharedFileBycode(code: string) {
  const [file] = await db
    .select()
    .from(files)
    .where(
      and(
        eq(files.share, true),
        eq(files.shareCode, code),
        eq(files.uploadStatus, "success")
      )
    );

  if (!file) {
    throw new Error(ErrorCode.INVALID_SHARE_CODE);
  }

  return file;
}
