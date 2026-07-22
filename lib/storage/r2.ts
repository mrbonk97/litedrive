import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { AppException, ExceptionCode } from "@/lib/errors";

interface DownloadFile {
  storagePath: string;
  name: string;
  mimeType: string;
}

function getR2Config() {
  const bucket = process.env.R2_BUCKET_NAME;
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!bucket || !endpoint || !accessKeyId || !secretAccessKey) {
    throw new AppException(ExceptionCode.CONFIGURATION_ERROR);
  }

  return { bucket, endpoint, accessKeyId, secretAccessKey };
}

function createR2Client() {
  const { endpoint, accessKeyId, secretAccessKey } = getR2Config();

  return new S3Client({
    region: "auto",
    endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  });
}

export function createR2StoragePath(userId: string, fileId: string) {
  return `uploads/users/${userId}/${fileId}`;
}

export function normalizeMimeType(mimeType: string) {
  return mimeType.trim() || "application/octet-stream";
}

export async function getR2ObjectMetadata(storagePath: string) {
  const { bucket } = getR2Config();
  return createR2Client().send(
    new HeadObjectCommand({ Bucket: bucket, Key: storagePath }),
  );
}

export async function deleteR2Object(storagePath: string) {
  const { bucket } = getR2Config();
  await createR2Client().send(
    new DeleteObjectCommand({ Bucket: bucket, Key: storagePath }),
  );
}

export async function createR2DownloadUrl(
  file: DownloadFile,
  expiresIn: number,
) {
  const { bucket } = getR2Config();
  const downloadName = file.name.replaceAll('"', "").replaceAll("/", "_");
  const encodedName = encodeURIComponent(downloadName);

  return getSignedUrl(
    createR2Client(),
    new GetObjectCommand({
      Bucket: bucket,
      Key: file.storagePath,
      ResponseContentType: normalizeMimeType(file.mimeType),
      ResponseContentDisposition:
        `attachment; filename="${downloadName}"; filename*=UTF-8''${encodedName}`,
    }),
    { expiresIn },
  );
}
