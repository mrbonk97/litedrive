import { db } from "@/db/db";
import { files, users } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { ErrorCode } from "@/lib/handle-error";
import { compareHash, hashPassword } from "@/lib/encrypt";
import { DeleteUserInput, UpdateUserInput } from "@/server/schemas/user.schema";

export async function deleteUser(userId: string, input: DeleteUserInput) {
  const [user] = await db
    .select({
      id: users.id,
      password: users.password,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    throw new Error(ErrorCode.USER_NOT_FOUND);
  }

  const isCorrect = await compareHash(input.password, user.password);

  if (!isCorrect) {
    throw new Error(ErrorCode.INVALID_PASSWORD);
  }

  await db.delete(users).where(eq(users.id, userId));
}

export async function getUserInfo(userId: string) {
  const [user] = await db
    .select({
      id: users.id,
      username: users.username,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,

      fileCount: sql<number>`count(${files.id})`.as("fileCount"),
      totalSize: sql<number>`coalesce(sum(${files.size}), 0)`.as("totalSize"),
    })
    .from(users)
    .leftJoin(files, eq(files.ownerId, users.id))
    .where(eq(users.id, userId))
    .groupBy(users.id);

  if (!user) {
    throw new Error(ErrorCode.USER_NOT_FOUND);
  }

  return user;
}

export async function updateUser(userId: string, input: UpdateUserInput) {
  const [user] = await db
    .select({
      id: users.id,
      password: users.password,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    throw new Error(ErrorCode.USER_NOT_FOUND);
  }

  const isCorrect = await compareHash(input.oldPassword, user.password);
  if (!isCorrect) {
    throw new Error(ErrorCode.INVALID_PASSWORD);
  }

  const newHashed = await hashPassword(input.newPassword);

  const [updatedUser] = await db
    .update(users)
    .set({ password: newHashed, updatedAt: new Date() })
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      username: users.username,
      updatedAt: users.updatedAt,
      createdAt: users.createdAt,
    });

  return updatedUser;
}
