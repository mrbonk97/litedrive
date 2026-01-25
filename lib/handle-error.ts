import { NextResponse } from "next/server";
import z, { ZodError } from "zod";

export enum ErrorCode {
  INVALID_INPUT = "입력값이 올바르지 않습니다.",
  UNAUTHORIZED = "권한이 없습니다.",
  USER_NOT_FOUND = "사용자를 찾을 수 없습니다.",
  SESSION_NOT_FOUND = "세션을 찾을 수 없습니다.",
  FILE_NOT_FOUND = "파일을 찾을 수 없습니다.",
  INVALID_PASSWORD = "패스워드가 올바르지 않습니다.",
  INTERNAL_ERROR = "서버 오류",
}

export function handleError(err: unknown) {
  console.error(err);

  // Zod 에러 처리
  if (err instanceof ZodError) {
    const tree = z.treeifyError(err);

    return NextResponse.json(
      { message: "입력값이 올바르지 않습니다", errors: tree },
      { status: 400 },
    );
  }
  return NextResponse.json({ message: "서버 오류" }, { status: 500 });
}
