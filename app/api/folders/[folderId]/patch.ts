import { handleError } from "@/lib/error";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { patchFolderSchema } from "@/schemas/folder-schema";
import { patchFolderById } from "@/services/folder-service";

interface Props {
  params: Promise<{ folderId: string }>;
}

export default async function PATCH(req: NextRequest, { params }: Props) {
  try {
    const session = await getSession();
    const { folderId } = await params;
    const body = await req.json();

    // 1. 입력값 검증
    const data = patchFolderSchema.parse(body);

    // 2. 폴더명 수정
    const folder = await patchFolderById(session.user!.id, folderId, data);

    return NextResponse.json({ folder });
  } catch (err) {
    return handleError(err);
  }
}
