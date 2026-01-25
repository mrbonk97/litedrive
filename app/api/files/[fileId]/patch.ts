import { handleError } from "@/lib/handle-error";
import { getSession } from "@/lib/session";
import { updateFileSchema } from "@/server/schemas/file.schema";
import { updateFile } from "@/server/services/file.service";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ fileId: string }>;
}

export default async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const session = await getSession();
    const { fileId } = await params;
    const body = await req.json();

    // 1. 입력값 검증
    const _body = updateFileSchema.parse(body);

    // 2. 파일 수정
    const file = await updateFile(session.user!.id, fileId, _body);

    return NextResponse.json({ file });
  } catch (err) {
    return handleError(err);
  }
}
