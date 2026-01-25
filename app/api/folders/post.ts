import { handleError } from "@/lib/handle-error";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { createFolder } from "@/server/services/folder.service";
import { createFolderSchema } from "@/server/schemas/folder.schema";

export default async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    // 1. 입력값 검증
    const _body = createFolderSchema.parse(body);

    // 2. 폴더 생성
    const folder = await createFolder(session.user!.id, _body);

    return NextResponse.json({ folder });
  } catch (err) {
    return handleError(err);
  }
}
