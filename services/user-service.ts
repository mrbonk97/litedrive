import { db } from "@/db/db";
import { and, eq, sql } from "drizzle-orm";
import { files, users } from "@/db/schema";
import { compareHash, encryptPassword } from "@/lib/encrypt";
import { ErrorCode } from "@/lib/handle-error";

export async function registerUser(username: string, password: string) {
  const hashed = await encryptPassword(password);

  const [user] = await db
    .insert(users)
    .values({ username, password: hashed })
    .returning();

  return user;
}

export async function loginUser(username: string, password: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.username, username)));

  if (!user) {
    throw new Error(ErrorCode.USER_NOT_FOUND);
  }

  const isCorrect = await compareHash(password, user.password);

  if (!isCorrect) {
    throw new Error(ErrorCode.INVALID_PASSWORD);
  }

  return user;
}

export async function deleteUser(userId: string, password: string) {
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

  const isCorrect = await compareHash(password, user.password);
  if (!isCorrect) {
    throw new Error(ErrorCode.INVALID_PASSWORD);
  }

  const [deletedUser] = await db
    .delete(users)
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      username: users.username,
      updatedAt: users.updatedAt,
      createdAt: users.createdAt,
    });

  return deletedUser;
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

export async function updateUserInfo(
  userId: string,
  oldPassword: string,
  newPassword: string
) {
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

  const isCorrect = await compareHash(oldPassword, user.password);
  if (!isCorrect) {
    throw new Error(ErrorCode.INVALID_PASSWORD);
  }

  const newHashed = await encryptPassword(newPassword);

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
