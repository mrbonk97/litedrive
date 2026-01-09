import { handleError } from "@/lib/handle-error";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { postFolderSchema } from "@/schemas/folder-schema";
import { postFolder } from "@/services/folder-service";

export default async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    // 1. 입력값 검증
    const { name, parentFolderId } = postFolderSchema.parse(body);

    // 2. 폴더 생성
    const folder = await postFolder(session.user!.id, name, parentFolderId);

    return NextResponse.json({ folder });
  } catch (err) {
    return handleError(err);
  }
}
