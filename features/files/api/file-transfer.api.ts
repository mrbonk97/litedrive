"use server";

import { createHmac } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { translateSupabaseError } from "@/lib/utils";
import type { FileType } from "@/types";
import { headers } from "next/headers";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { AppException, ExceptionCode } from "@/lib/errors";
import {
  createR2DownloadUrl,
  createR2StoragePath,
  deleteR2Object,
  getR2ObjectMetadata,
  normalizeMimeType,
} from "@/lib/storage/r2";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const STORAGE_LIMIT_BYTES = 500 * 1024 * 1024;
const TOKEN_TTL_SECONDS = 5 * 60;
const UPLOAD_STATUS = {
  PENDING: "pending",
  SUCCESS: "success",
  FAIL: "fail",
} as const;

type FileTransferResult<T> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: string;
    };

type TransferTokenPayload = {
  sub: string;
  fileId: string;
  fileName: string;
  mimeType: string;
  size?: number;
  operation: "upload" | "download" | "delete";
  iat: number;
  exp: number;
};

type PrepareUploadInput = {
  name: string;
  size: number;
  mimeType: string;
  folderId: string | null;
};

type CompleteUploadInput = PrepareUploadInput & {
  fileId: string;
  storagePath: string;
};

type WorkerTransfer = {
  workerUrl: string;
  token: string;
};

type PreparedUpload = WorkerTransfer & {
  fileId: string;
  storagePath: string;
};

type PreparedDownload = WorkerTransfer & {
  fileName: string;
  downloadUrl?: string;
};

type UploadStatus = (typeof UPLOAD_STATUS)[keyof typeof UPLOAD_STATUS];

function getWorkerUrl() {
  const url = process.env.NEXT_PUBLIC_WORKER_ENDPOINT;

  if (!url) {
    throw new AppException(ExceptionCode.CONFIGURATION_ERROR);
  }

  return url.replace(/\/$/, "");
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppException(ExceptionCode.CONFIGURATION_ERROR);
  }

  return secret;
}

function encodeBase64Url(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function createTransferToken(
  payload: Omit<TransferTokenPayload, "iat" | "exp">,
) {
  const now = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url({ alg: "HS256", typ: "JWT" });
  const body = encodeBase64Url({
    ...payload,
    iat: now,
    exp: now + TOKEN_TTL_SECONDS,
  });
  const unsignedToken = `${header}.${body}`;
  const signature = createHmac("sha256", getJwtSecret())
    .update(unsignedToken)
    .digest("base64url");

  return `${unsignedToken}.${signature}`;
}

function validateFileInput(input: Pick<PrepareUploadInput, "name" | "size">) {
  if (!input.name.trim()) {
    return "파일 이름이 올바르지 않습니다.";
  }

  if (input.size <= 0) {
    return "빈 파일은 업로드할 수 없습니다.";
  }

  if (input.size > MAX_FILE_SIZE) {
    return "파일 크기는 최대 10MB까지 가능합니다.";
  }

  return null;
}

async function updateFileUploadStatus(
  fileId: string,
  status: UploadStatus,
) {
  const supabase = await createClient();

  return supabase
    .from("files")
    .update({
      upload_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", fileId);
}

export async function prepareFileUpload(
  input: PrepareUploadInput,
): Promise<FileTransferResult<PreparedUpload>> {
  try {
    const validationError = validateFileInput(input);
    if (validationError) {
      return { data: null, error: validationError };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { data: null, error: "로그인이 필요합니다." };
    }

    if (input.folderId) {
      const { data: folder } = await supabase
        .from("folders")
        .select("id")
        .eq("id", input.folderId)
        .maybeSingle();
      if (!folder) return { data: null, error: "폴더를 찾을 수 없습니다." };
    }

    const { data: existingFiles, error: usageError } = await supabase
      .from("files")
      .select("size")
      .in("upload_status", [UPLOAD_STATUS.PENDING, UPLOAD_STATUS.SUCCESS]);
    if (usageError)
      return { data: null, error: translateSupabaseError(usageError) };
    const usedBytes = (existingFiles ?? []).reduce(
      (total, file) => total + Number(file.size ?? 0),
      0,
    );
    if (usedBytes + input.size > STORAGE_LIMIT_BYTES) {
      return { data: null, error: "저장 공간 500MB를 초과할 수 없습니다." };
    }

    const fileId = crypto.randomUUID();
    const mimeType = normalizeMimeType(input.mimeType);
    const storagePath = createR2StoragePath(user.id, fileId);

    const { error: insertError } = await supabase.from("files").insert({
      id: fileId,
      user_id: user.id,
      folder_id: input.folderId,
      name: input.name,
      size: input.size,
      mime_type: mimeType,
      storage_path: storagePath,
      upload_status: UPLOAD_STATUS.PENDING,
    });

    if (insertError) {
      return { data: null, error: translateSupabaseError(insertError) };
    }

    return {
      data: {
        fileId,
        storagePath,
        workerUrl: getWorkerUrl(),
        token: createTransferToken({
          sub: user.id,
          fileId,
          fileName: input.name,
          mimeType,
          size: input.size,
          operation: "upload",
        }),
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: translateSupabaseError(error, "업로드 준비에 실패했습니다."),
    };
  }
}

export async function completeFileUpload(
  input: CompleteUploadInput,
): Promise<FileTransferResult<FileType>> {
  try {
    const validationError = validateFileInput(input);
    if (validationError) {
      return { data: null, error: validationError };
    }

    const supabase = await createClient();

    const { data: pendingFile, error: pendingError } = await supabase
      .from("files")
      .select("*")
      .eq("id", input.fileId)
      .eq("upload_status", UPLOAD_STATUS.PENDING)
      .single();
    if (
      pendingError ||
      !pendingFile ||
      pendingFile.storage_path !== input.storagePath
    ) {
      return { data: null, error: "업로드 정보를 찾을 수 없습니다." };
    }

    const expectedStoragePath = createR2StoragePath(
      pendingFile.user_id,
      input.fileId,
    );
    if (input.storagePath !== expectedStoragePath) {
      return { data: null, error: "파일 저장 경로가 올바르지 않습니다." };
    }

    const head = await getR2ObjectMetadata(input.storagePath);
    if (head.ContentLength !== pendingFile.size) {
      await deleteR2Object(input.storagePath);
      await updateFileUploadStatus(input.fileId, UPLOAD_STATUS.FAIL);
      return { data: null, error: "업로드된 파일 크기가 올바르지 않습니다." };
    }

    const { data, error } = await supabase
      .from("files")
      .update({
        upload_status: UPLOAD_STATUS.SUCCESS,
        updated_at: new Date().toISOString(),
      })
      .eq("id", input.fileId)
      .eq("upload_status", UPLOAD_STATUS.PENDING)
      .select()
      .single();

    if (error) {
      await deleteR2Object(input.storagePath);
      await updateFileUploadStatus(input.fileId, UPLOAD_STATUS.FAIL);

      return { data: null, error: translateSupabaseError(error) };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: translateSupabaseError(error, "업로드 완료 처리에 실패했습니다."),
    };
  }
}

export async function markFileUploadFailed(
  fileId: string,
): Promise<FileTransferResult<FileType>> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("files")
      .update({
        upload_status: UPLOAD_STATUS.FAIL,
        updated_at: new Date().toISOString(),
      })
      .eq("id", fileId)
      .select()
      .single();

    if (error) {
      return { data: null, error: translateSupabaseError(error) };
    }

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: translateSupabaseError(error, "업로드 실패 처리에 실패했습니다."),
    };
  }
}

export async function prepareFileDownload(
  fileId: string,
): Promise<FileTransferResult<PreparedDownload>> {
  try {
    const supabase = await createClient();

    const { data: file, error } = await supabase
      .from("files")
      .select("*")
      .eq("id", fileId)
      .eq("upload_status", UPLOAD_STATUS.SUCCESS)
      .single();

    if (error || !file) {
      return { data: null, error: "파일을 찾을 수 없습니다." };
    }

    return {
      data: {
        fileName: file.name,
        downloadUrl: await createR2DownloadUrl(
          {
            storagePath: file.storage_path,
            name: file.name,
            mimeType: file.mime_type,
          },
          TOKEN_TTL_SECONDS,
        ),
        workerUrl: getWorkerUrl(),
        token: createTransferToken({
          sub: file.user_id,
          fileId: file.id,
          fileName: file.name,
          mimeType: normalizeMimeType(file.mime_type),
          operation: "download",
        }),
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: translateSupabaseError(error, "다운로드 준비에 실패했습니다."),
    };
  }
}

export async function prepareSharedFileDownload(
  shareToken: string,
): Promise<FileTransferResult<PreparedDownload>> {
  try {
    const token = shareToken.trim();

    if (!/^[A-Za-z0-9_-]{8,64}$/.test(token)) {
      return { data: null, error: "공유 코드가 올바르지 않습니다." };
    }

    const headerStore = await headers();
    const clientKey =
      headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(`share-download:${clientKey}`, 10, 60_000)) {
      return { data: null, error: "잠시 후 다시 시도해주세요." };
    }

    const admin = createAdminClient();
    const { data: file, error } = await admin
      .from("files")
      .select("*")
      .eq("share_token", token)
      .eq("is_shared", true)
      .eq("upload_status", UPLOAD_STATUS.SUCCESS)
      .single();

    if (error || !file) {
      return { data: null, error: "파일을 찾을 수 없습니다." };
    }

    return {
      data: {
        fileName: file.name,
        downloadUrl: await createR2DownloadUrl(
          {
            storagePath: file.storage_path,
            name: file.name,
            mimeType: file.mime_type,
          },
          TOKEN_TTL_SECONDS,
        ),
        workerUrl: getWorkerUrl(),
        token: createTransferToken({
          sub: file.user_id,
          fileId: file.id,
          fileName: file.name,
          mimeType: normalizeMimeType(file.mime_type),
          operation: "download",
        }),
      },
      error: null,
    };
  } catch (error) {
    return {
      data: null,
      error: translateSupabaseError(error, "다운로드 준비에 실패했습니다."),
    };
  }
}
