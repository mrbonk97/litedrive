import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/error";
import { deleteFileById } from "@/services/file-service";

interface Props {
  params: Promise<{ fileId: string }>;
}

export default async function DELETE(_: NextRequest, { params }: Props) {
  try {
    const session = await getSession();

    const { fileId } = await params;

    const file = await deleteFileById(session.user!.id, fileId);

    return NextResponse.json({ file });
  } catch (err) {
    return handleError(err);
  }
}
