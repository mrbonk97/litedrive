import { handleError } from "@/lib/error";
import { s3Client } from "@/lib/tebi";
import { getSharedFileById } from "@/services/file-service";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const code = sp.get("code");
  const type = sp.get("type");

  try {
    if (typeof code !== "string") {
      throw new Error("code 형식이 올바르지 않습니다.");
    }

    if (typeof type !== "string") {
      throw new Error("type 형식이 올바르지 않습니다.");
    }

    if (type === "check") {
      const file = await getSharedFileById(code);
      return NextResponse.json({ file });
    }

    if (type === "download") {
      const file = await getSharedFileById(code);

      const get_command = new GetObjectCommand({
        Bucket: "litedrive",
        Key: file.id,
        ResponseContentDisposition: `attachment; filename="${encodeURIComponent(
          file.name
        )}"`,
      });

      const url = await getSignedUrl(s3Client, get_command, { expiresIn: 60 });
      return NextResponse.json({ url });
    }
  } catch (err) {
    return handleError(err);
  }
}
