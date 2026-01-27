import { getSession } from "@/lib/session";
import { handleError } from "@/lib/handle-error";
import { NextRequest, NextResponse } from "next/server";
import { createFile } from "@/server/services/file.service";
import { createFileSchema } from "@/server/schemas/file.schema";
import { generateJwt } from "@/lib/jwt";

export default async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    // 1. 입력값 검증
    const _body = createFileSchema.parse(body);

    // 2. 파일 Row 생성
    const file = await createFile(session.user!.id, _body);

    const token = await generateJwt(session.user!.id, file.id);

    return NextResponse.json({ token, file }, { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}
