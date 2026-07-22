/// <reference types="@cloudflare/workers-types" />

import { jwtVerify } from "jose";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

interface Env {
  MY_BUCKET: R2Bucket;
  JWT_SECRET: string;
  ALLOWED_ORIGINS?: string;
}

interface TransferTokenPayload {
  sub: string;
  fileId: string;
  fileName: string;
  mimeType: string;
  size?: number;
  operation: "upload" | "download" | "delete";
  iat: number;
  exp: number;
}

interface LimitedStream {
  stream: ReadableStream<Uint8Array>;
  getBytesRead: () => number;
  isLimitExceeded: () => boolean;
}

export default {
  async fetch(request, env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return handleOptions(request, env);
    }

    if (!isOriginAllowed(request, env)) {
      return textResponse("허용되지 않은 Origin입니다.", 403, request, env);
    }

    const payload = await authenticate(request, env.JWT_SECRET);

    if (!payload) {
      return textResponse("인증 정보가 올바르지 않습니다.", 401, request, env);
    }

    switch (request.method) {
      case "POST":
        return handleUpload(request, env, payload);
      case "GET":
        return handleDownload(request, env, payload);
      case "DELETE":
        return handleDelete(request, env, payload);
      default:
        return textResponse("허용되지 않은 요청 방식입니다.", 405, request, env, {
          Allow: "POST, GET, DELETE, OPTIONS",
        });
    }
  },
} satisfies ExportedHandler<Env>;

async function handleUpload(
  request: Request,
  env: Env,
  payload: TransferTokenPayload,
) {
  if (payload.operation !== "upload") {
    return textResponse("업로드 권한이 없습니다.", 403, request, env);
  }

  if (
    typeof payload.size !== "number" ||
    !Number.isSafeInteger(payload.size) ||
    payload.size <= 0 ||
    payload.size > MAX_FILE_SIZE
  ) {
    return textResponse("파일 크기는 최대 10MB까지 가능합니다.", 413, request, env);
  }

  const contentLength = parseContentLength(request.headers.get("content-length"));

  if (contentLength !== null && contentLength > MAX_FILE_SIZE) {
    try {
      await request.body?.cancel("File size limit exceeded");
    } catch {
      // The response must still reject an oversized request if cancellation fails.
    }
    return textResponse("파일 크기는 최대 10MB까지 가능합니다.", 413, request, env);
  }

  if (contentLength !== null && contentLength !== payload.size) {
    return textResponse("요청한 파일 크기가 올바르지 않습니다.", 400, request, env);
  }

  if (!request.body) {
    return textResponse("파일 본문이 없습니다.", 400, request, env);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/octet-stream")) {
    return textResponse("지원하지 않는 Content-Type입니다.", 400, request, env);
  }

  const key = createStorageKey(payload);
  const limited = createSizeLimitedStream(request.body, MAX_FILE_SIZE);
  const fixedLength = new FixedLengthStream(payload.size);
  const pipeController = new AbortController();
  const pipePromise = limited.stream.pipeTo(fixedLength.writable, {
    signal: pipeController.signal,
  });
  let uploaded: R2Object | null;

  try {
    [uploaded] = await Promise.all([
      env.MY_BUCKET.put(key, fixedLength.readable, {
        onlyIf: { etagDoesNotMatch: "*" },
        httpMetadata: {
          contentType: normalizeMimeType(payload.mimeType),
        },
        customMetadata: {
          userId: payload.sub,
          fileId: payload.fileId,
        },
      }),
      pipePromise,
    ]);
  } catch (error) {
    pipeController.abort(error);
    await Promise.allSettled([pipePromise]);

    console.error(
      JSON.stringify({
        message: "R2 upload failed",
        fileId: payload.fileId,
        bytesRead: limited.getBytesRead(),
        error: error instanceof Error ? error.message : String(error),
      }),
    );

    if (limited.isLimitExceeded()) {
      return textResponse("파일 크기는 최대 10MB까지 가능합니다.", 413, request, env);
    }

    return textResponse("R2 파일 저장에 실패했습니다.", 502, request, env);
  }

  if (limited.isLimitExceeded() || limited.getBytesRead() > MAX_FILE_SIZE) {
    if (uploaded) await env.MY_BUCKET.delete(key);
    return textResponse("파일 크기는 최대 10MB까지 가능합니다.", 413, request, env);
  }

  if (!uploaded) {
    return textResponse("이미 업로드된 파일입니다.", 409, request, env);
  }

  if (
    uploaded.size !== limited.getBytesRead() ||
    uploaded.size !== payload.size
  ) {
    await env.MY_BUCKET.delete(key);
    return textResponse("업로드된 파일 크기가 올바르지 않습니다.", 400, request, env);
  }

  return jsonResponse(
    { fileId: payload.fileId, size: uploaded.size, etag: uploaded.etag },
    201,
    request,
    env,
  );
}

async function handleDownload(
  request: Request,
  env: Env,
  payload: TransferTokenPayload,
) {
  if (payload.operation !== "download") {
    return textResponse("다운로드 권한이 없습니다.", 403, request, env);
  }

  const object = await env.MY_BUCKET.get(createStorageKey(payload));

  if (!object) {
    return textResponse("파일을 찾을 수 없습니다.", 404, request, env);
  }

  const headers = corsHeaders(request, env);
  object.writeHttpMetadata(headers);
  headers.set("Content-Type", normalizeMimeType(payload.mimeType));
  headers.set("Content-Disposition", createContentDisposition(payload.fileName));
  headers.set("Content-Length", String(object.size));
  headers.set("ETag", object.httpEtag);

  return new Response(object.body, { status: 200, headers });
}

async function handleDelete(
  request: Request,
  env: Env,
  payload: TransferTokenPayload,
) {
  if (payload.operation !== "delete") {
    return textResponse("삭제 권한이 없습니다.", 403, request, env);
  }

  await env.MY_BUCKET.delete(createStorageKey(payload));
  return new Response(null, { status: 204, headers: corsHeaders(request, env) });
}

async function authenticate(request: Request, secret: string) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ") || !secret) return null;

  const token = authorization.slice("Bearer ".length);
  const segments = token.split(".");

  if (segments.length !== 3) return null;

  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload: verified } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
      requiredClaims: ["sub", "iat", "exp"],
      maxTokenAge: "10m",
    });
    const payload = verified as unknown as TransferTokenPayload;
    const now = Math.floor(Date.now() / 1000);

    if (
      !isUuid(payload.sub) ||
      !isUuid(payload.fileId) ||
      typeof payload.fileName !== "string" ||
      !payload.fileName ||
      typeof payload.mimeType !== "string" ||
      !["upload", "download", "delete"].includes(payload.operation) ||
      !Number.isSafeInteger(payload.iat) ||
      !Number.isSafeInteger(payload.exp) ||
      payload.iat > now + 60 ||
      payload.exp <= now ||
      payload.exp - payload.iat > 10 * 60
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function createSizeLimitedStream(
  body: ReadableStream<Uint8Array>,
  maxBytes: number,
): LimitedStream {
  const reader = body.getReader();
  let bytesRead = 0;
  let limitExceeded = false;

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        const { done, value } = await reader.read();

        if (done) {
          controller.close();
          return;
        }

        bytesRead += value.byteLength;

        if (bytesRead > maxBytes) {
          limitExceeded = true;
          await reader.cancel("File size limit exceeded");
          controller.error(new Error("File size limit exceeded"));
          return;
        }

        controller.enqueue(value);
      } catch (error) {
        controller.error(error);
      }
    },
    cancel(reason) {
      return reader.cancel(reason);
    },
  });

  return {
    stream,
    getBytesRead: () => bytesRead,
    isLimitExceeded: () => limitExceeded,
  };
}

function handleOptions(request: Request, env: Env) {
  if (!isOriginAllowed(request, env)) {
    return textResponse("허용되지 않은 Origin입니다.", 403, request, env);
  }

  return new Response(null, {
    status: 204,
    headers: {
      ...Object.fromEntries(corsHeaders(request, env)),
      "Access-Control-Allow-Methods": "POST, GET, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

function isOriginAllowed(request: Request, env: Env) {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  const allowedOrigins = (env.ALLOWED_ORIGINS ?? "*")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return allowedOrigins.includes("*") || allowedOrigins.includes(origin);
}

function corsHeaders(request: Request, env: Env) {
  const headers = new Headers({ Vary: "Origin" });
  const origin = request.headers.get("origin");
  const allowedOrigins = env.ALLOWED_ORIGINS ?? "*";

  if (allowedOrigins.split(",").map((value) => value.trim()).includes("*")) {
    headers.set("Access-Control-Allow-Origin", "*");
  } else if (origin && isOriginAllowed(request, env)) {
    headers.set("Access-Control-Allow-Origin", origin);
  }

  return headers;
}

function textResponse(
  message: string,
  status: number,
  request: Request,
  env: Env,
  extraHeaders?: HeadersInit,
) {
  const headers = corsHeaders(request, env);
  headers.set("Content-Type", "text/plain; charset=utf-8");

  if (extraHeaders) {
    new Headers(extraHeaders).forEach((value, key) => headers.set(key, value));
  }

  return new Response(message, { status, headers });
}

function jsonResponse(
  value: unknown,
  status: number,
  request: Request,
  env: Env,
) {
  const headers = corsHeaders(request, env);
  headers.set("Content-Type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(value), { status, headers });
}

function createStorageKey(payload: TransferTokenPayload) {
  return `uploads/users/${payload.sub}/${payload.fileId}`;
}

function parseContentLength(value: string | null) {
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed >= 0 ? parsed : null;
}

function normalizeMimeType(value: string) {
  return value.trim() || "application/octet-stream";
}

function createContentDisposition(fileName: string) {
  const safeName = fileName.replaceAll('"', "").replaceAll("/", "_");
  return `attachment; filename="${safeName}"; filename*=UTF-8''${encodeURIComponent(safeName)}`;
}

function isUuid(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      value,
    )
  );
}
