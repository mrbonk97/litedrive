import { S3Client } from "@aws-sdk/client-s3";

const credentials = {
  accessKeyId: process.env.TEBI_KEY!,
  secretAccessKey: process.env.TEBI_SECRET!,
};

// Create an S3 service client object.
export const s3Client = new S3Client({
  endpoint: "https://s3.tebi.io",
  credentials: credentials,
  region: "global",
});
