import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/handle-error";
import { deleteFolderById } from "@/services/folder-service";

interface Props {
  params: Promise<{ folderId: string }>;
}

export default async function DELETE(_: NextRequest, { params }: Props) {
  try {
    const session = await getSession();
    const { folderId } = await params;

    const folder = await deleteFolderById(session.user!.id, folderId);

    return NextResponse.json({ folder });
  } catch (err) {
    return handleError(err);
  }
}
