import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { AppException } from "@/lib/errors";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const INTERNAL_EMAIL_DOMAIN = "litedrive.local";

export function createInternalEmail(username: string) {
  return `${username.toLowerCase()}@${INTERNAL_EMAIL_DOMAIN}`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(new Date(value));
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));

  return `${(bytes / Math.pow(1024, index)).toFixed(1)} ${units[index]}`;
}

export function getUsername(email?: string) {
  if (!email) {
    return "사용자";
  }

  return email.split("@")[0];
}

const SUPPORT_ICONS = [
  "3ds",
  "aac",
  "ai.",
  "avi",
  "bmp",
  "cad",
  "cdr",
  "dat",
  "dll",
  "doc",
  "eps",
  "flv",
  "gif",
  "htm",
  "ind",
  "iso",
  "jpg",
  "mid",
  "mov",
  "mp3",
  "pdf",
  "php",
  "png",
  "ppt",
  "ps.",
  "psd",
  "raw",
  "sql",
  "svg",
  "tif",
  "txt",
  "wmv",
  "xls",
  "xml",
  "zip",
];

const SUPPORT_ICON_SET = new Set(SUPPORT_ICONS);

export function getIcon(filename: string) {
  const lastDotIndex = filename.lastIndexOf(".");

  if (lastDotIndex <= 0 || lastDotIndex === filename.length - 1) {
    return "/icons/other.png";
  }

  const ext = filename.slice(lastDotIndex + 1).toLowerCase();

  if (SUPPORT_ICON_SET.has(ext)) {
    return `/icons/${ext}.png`;
  }

  return "/icons/other.png";
}

const SUPABASE_ERROR_MESSAGES: Array<[RegExp, string]> = [
  [/invalid login credentials/i, "아이디 또는 비밀번호가 올바르지 않습니다."],
  [/email not confirmed/i, "이메일 인증이 완료되지 않았습니다."],
  [
    /user already registered|already been registered|already exists/i,
    "이미 가입된 계정입니다.",
  ],
  [
    /signup.*disabled|signups not allowed/i,
    "현재 회원가입이 비활성화되어 있습니다.",
  ],
  [
    /password should be at least|password.*characters/i,
    "비밀번호가 너무 짧습니다.",
  ],
  [/weak password/i, "비밀번호가 너무 약합니다."],
  [
    /same password|different from the old password/i,
    "기존 비밀번호와 다른 비밀번호를 입력해주세요.",
  ],
  [/invalid.*password|current password/i, "현재 비밀번호가 올바르지 않습니다."],
  [
    /jwt expired|token.*expired|session.*expired/i,
    "로그인 세션이 만료되었습니다. 다시 로그인해주세요.",
  ],
  [
    /invalid jwt|invalid token|bad jwt/i,
    "인증 정보가 올바르지 않습니다. 다시 로그인해주세요.",
  ],
  [
    /refresh token.*not found|invalid refresh token/i,
    "로그인 세션을 찾을 수 없습니다. 다시 로그인해주세요.",
  ],
  [
    /row level security|violates row-level security/i,
    "요청한 작업을 수행할 권한이 없습니다.",
  ],
  [
    /permission denied|not authorized|unauthorized/i,
    "요청한 작업을 수행할 권한이 없습니다.",
  ],
  [/duplicate key value|unique constraint/i, "이미 존재하는 값입니다."],
  [/foreign key constraint/i, "연결된 데이터를 찾을 수 없습니다."],
  [/not found|no rows/i, "요청한 데이터를 찾을 수 없습니다."],
  [/network|fetch failed/i, "네트워크 연결을 확인해주세요."],
];

export function translateSupabaseError(
  error: unknown,
  fallback = "요청 처리 중 오류가 발생했습니다.",
) {
  if (error instanceof AppException) {
    return error.message;
  }

  const message =
    typeof error === "string"
      ? error
      : error instanceof Error
        ? error.message
        : typeof error === "object" && error && "message" in error
          ? String(error.message)
          : "";

  if (!message) {
    return fallback;
  }

  const matched = SUPABASE_ERROR_MESSAGES.find(([pattern]) =>
    pattern.test(message),
  );

  return matched?.[1] ?? fallback;
}
