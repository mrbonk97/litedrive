import { handleError } from "@/lib/handle-error";
import { getSession } from "@/lib/session";
import { patchFileById } from "@/services/file-service";
import { NextRequest, NextResponse } from "next/server";
import { patchFileSchema } from "@/schemas/file-schema";

interface Props {
  params: Promise<{ fileId: string }>;
}

export default async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const session = await getSession();
    const { fileId } = await params;
    const body = await req.json();

    // 1. 입력값 검증
    const data = patchFileSchema.parse(body);

    // 2. 파일 수정
    const file = await patchFileById(session.user!.id, fileId, data);

    return NextResponse.json({ file });
  } catch (err) {
    return handleError(err);
  }
}
