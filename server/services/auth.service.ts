import "server-only";

import { db } from "@/db/db";
import { users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ErrorCode } from "@/lib/handle-error";
import { compareHash, hashPassword } from "@/lib/encrypt";
import { SignInInput, SignUpInput } from "../schemas/auth.schema";

export async function login(input: SignInInput) {
  const [user] = await db
    .select()
    .from(users)
    .where(and(eq(users.username, input.username)));

  if (!user) {
    throw new Error(ErrorCode.USER_NOT_FOUND);
  }

  const isCorrect = await compareHash(input.password, user.password);

  if (!isCorrect) {
    throw new Error(ErrorCode.INVALID_PASSWORD);
  }

  return user;
}

export async function signUp(input: SignUpInput) {
  const hashed = await hashPassword(input.password);

  const [user] = await db
    .insert(users)
    .values({ username: input.username, password: hashed })
    .returning();

  return user;
}
