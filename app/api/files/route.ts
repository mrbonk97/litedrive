import { handleError } from "@/lib/handle-error";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { postFileSchema } from "@/schemas/file-schema";
import { postFile } from "@/services/file-service";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/tebi";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    // 1. 입력값 검증
    const { name, type, size, folderId } = postFileSchema.parse(body);

    // 2. 파일 업로드
    const file = await postFile(session.user!.id, name, type, size, folderId);

    // 3. PreSignedUrl 발급
    const preSignedUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand({ Bucket: "litedrive", Key: file.id }),
      { expiresIn: 60 }
    );

    return NextResponse.json({ file, url: preSignedUrl });
  } catch (err) {
    return handleError(err);
  }
}
