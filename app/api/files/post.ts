import { handleError } from "@/lib/handle-error";
import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { uploadFileSchema } from "@/server/schemas/file.schema";
import { uploadFile } from "@/server/services/file.service";

export default async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    // 1. 입력값 검증
    const _body = uploadFileSchema.parse(body);

    // 2. 파일 DB에 등록
    const file = await uploadFile(session.user!.id, _body);

    // 3. PreSignedUrl 발급
    const command = new PutObjectCommand({
      Bucket: "litedrive",
      Key: file.id,
      ContentType: file.type,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 60, // 1분
    });

    return NextResponse.json({ file, url });
  } catch (err) {
    return handleError(err);
  }
}
