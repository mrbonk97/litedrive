import "server-only";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NeonDbError } from "@neondatabase/serverless";
import { CustomError, ErrorCode } from "@/lib/handle-error";
import { compareHash, hashPassword } from "@/lib/encrypt";
import { SignInInput, SignUpInput } from "../schemas/auth.schema";

export async function login(input: SignInInput) {
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.username, input.username)));

  if (!user) {
    throw new CustomError(ErrorCode.USER_NOT_FOUND);
  }

  const isCorrect = await compareHash(input.password, user.password);

  if (!isCorrect) {
    throw new CustomError(ErrorCode.INVALID_PASSWORD);
  }

  return user;
}

export async function signUp(input: SignUpInput) {
  const hashed = await hashPassword(input.password);

  try {
    const [user] = await db
      .insert(users)
      .values({ username: input.username, password: hashed })
      .returning();

    return user;
  } catch (err) {
    // PostgreSQL 기준
    if (
      err instanceof Error &&
      err.cause instanceof NeonDbError &&
      err.cause.code === "23505"
    ) {
      throw new CustomError("아이디가 이미 존재합니다");
    }

    throw err;
  }
}
