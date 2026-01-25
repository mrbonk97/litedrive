import { handleError } from "@/lib/handle-error";
import { getSession } from "@/lib/session";
import { updateFolderSchema } from "@/server/schemas/folder.schema";
import { updateFolder } from "@/server/services/folder.service";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ folderId: string }>;
}

export default async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const session = await getSession();
    const { folderId } = await params;
    const body = await req.json();

    // 1. 입력값 검증
    const _body = updateFolderSchema.parse(body);

    // 2. 폴더명 수정
    const folder = await updateFolder(session.user!.id, folderId, _body);

    return NextResponse.json({ folder });
  } catch (err) {
    return handleError(err);
  }
}
