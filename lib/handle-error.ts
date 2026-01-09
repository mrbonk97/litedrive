import { NextResponse } from "next/server";
import z, { ZodError } from "zod";

export enum ErrorCode {
  INVALID_INPUT = "INVALID_INPUT",
  UNAUTHORIZED = "UNAUTHORIZED",
  USER_NOT_FOUND = "USER_NOT_FOUND",
  SESSION_NOT_FOUND = "SESSION_NOT_FOUND",
  INVALID_PASSWORD = "INVALID_PASSWORD",
  FILE_NOT_FOUND = "FILE_NOT_FOUND",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export function handleError(err: unknown) {
  console.log(err);

  // 1️. Zod 검증 에러
  if (err instanceof ZodError) {
    const tree = z.treeifyError(err);

    return NextResponse.json(
      { message: "입력값이 올바르지 않습니다", errors: tree },
      { status: 400 }
    );
  }

  return NextResponse.json({ message: "서버 오류" }, { status: 500 });
}
