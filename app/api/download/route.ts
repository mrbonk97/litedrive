import { ErrorCode } from "@/lib/handle-error";
import { handleError } from "@/lib/handle-error";
import { s3Client } from "@/lib/s3";
import { getSharedFileById } from "@/server/services/file.service";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const code = sp.get("code");

  try {
    if (typeof code !== "string") {
      throw new Error(ErrorCode.INVALID_INPUT);
    }

    const file = await getSharedFileById(code);

    const command = new GetObjectCommand({
      Bucket: "litedrive",
      Key: file.id,
      ResponseContentDisposition: `attachment; filename="${file.name}"`,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 60,
    });

    return NextResponse.json({ url });
  } catch (err) {
    return handleError(err);
  }
}
