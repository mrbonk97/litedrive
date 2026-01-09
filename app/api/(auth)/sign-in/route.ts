import { handleError } from "@/lib/handle-error";
import { createSession } from "@/lib/session";
import { registerSchema } from "@/schemas/auth-schema";
import { loginUser } from "@/services/user-service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. 입력값 검증
    const { username, password } = registerSchema.parse(body);

    // 2. 사용자 로그인
    const user = await loginUser(username, password);

    // 3. 세션 발급
    await createSession(user.id, user.username);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
