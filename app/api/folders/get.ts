import { handleError } from "@/lib/error";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { getRootFolder } from "@/services/folder-service";

export default async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    // // 1. 입력값 검증
    const params = req.nextUrl.searchParams;
    const q = params.get("q");
    const filter = params.get("filter");

    // 2. 폴더 조회
    const { files, folders } = await getRootFolder(session.user!.id, q, filter);

    return NextResponse.json({ files, folders, breadCrumb: [] });
  } catch (err) {
    return handleError(err);
  }
}
