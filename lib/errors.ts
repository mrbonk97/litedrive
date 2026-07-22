export enum ExceptionCode {
  AUTH_REQUIRED = "AUTH_REQUIRED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  INVALID_INPUT = "INVALID_INPUT",
  CONFLICT = "CONFLICT",
  RATE_LIMITED = "RATE_LIMITED",
  STORAGE_LIMIT_EXCEEDED = "STORAGE_LIMIT_EXCEEDED",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
  CONFIGURATION_ERROR = "CONFIGURATION_ERROR",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

const DEFAULT_MESSAGES: Record<ExceptionCode, string> = {
  [ExceptionCode.AUTH_REQUIRED]: "로그인이 필요합니다.",
  [ExceptionCode.FORBIDDEN]: "요청한 작업을 수행할 권한이 없습니다.",
  [ExceptionCode.NOT_FOUND]: "요청한 데이터를 찾을 수 없습니다.",
  [ExceptionCode.INVALID_INPUT]: "입력값이 올바르지 않습니다.",
  [ExceptionCode.CONFLICT]: "요청이 현재 상태와 충돌합니다.",
  [ExceptionCode.RATE_LIMITED]: "잠시 후 다시 시도해주세요.",
  [ExceptionCode.STORAGE_LIMIT_EXCEEDED]:
    "저장 공간 500MB를 초과할 수 없습니다.",
  [ExceptionCode.EXTERNAL_SERVICE_ERROR]:
    "외부 서비스 처리 중 오류가 발생했습니다.",
  [ExceptionCode.CONFIGURATION_ERROR]: "서버 설정이 올바르지 않습니다.",
  [ExceptionCode.INTERNAL_ERROR]: "요청 처리 중 오류가 발생했습니다.",
};

export class AppException extends Error {
  readonly code: ExceptionCode;

  constructor(code: ExceptionCode, message = DEFAULT_MESSAGES[code]) {
    super(message);
    this.name = "AppException";
    this.code = code;
  }
}

export function getExceptionMessage(error: unknown, fallback?: string) {
  return error instanceof AppException
    ? error.message
    : (fallback ?? DEFAULT_MESSAGES[ExceptionCode.INTERNAL_ERROR]);
}
