import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { handleError } from "@/lib/error";
import { getFileById } from "@/services/file-service";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/tebi";

interface Props {
  params: Promise<{ fileId: string }>;
}

export default async function GET(_: NextRequest, { params }: Props) {
  try {
    const session = await getSession();
    const { fileId } = await params;

    const file = await getFileById(session.user!.id, fileId);

    const get_command = new GetObjectCommand({
      Bucket: "litedrive",
      Key: file.id,
      ResponseContentDisposition: `attachment; filename="${encodeURIComponent(
        file.name
      )}"`,
    });

    const url = await getSignedUrl(s3Client, get_command, { expiresIn: 60 });

    return NextResponse.json({ url });
  } catch (err) {
    return handleError(err);
  }
}
