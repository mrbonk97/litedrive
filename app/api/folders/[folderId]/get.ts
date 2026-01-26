import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/handle-error";
import {
  findFolder,
  getFolderBreadcrumb,
} from "@/server/services/folder.service";

interface Props {
  params: Promise<{ folderId: string }>;
}

export default async function GET(_: NextRequest, { params }: Props) {
  try {
    const session = await getSession();
    const { folderId } = await params;

    const { files, folders } = await findFolder(session.user!.id, folderId);

    const breadCrumb = await getFolderBreadcrumb(session.user!.id, folderId);

    return NextResponse.json({ files, folders, breadCrumb });
  } catch (err) {
    return handleError(err);
  }
}
