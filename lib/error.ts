import { NextResponse } from "next/server";
import z, { ZodError } from "zod";

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
