import type { FileType } from "@/types";

export const STORAGE_LIMIT_BYTES = 500 * 1024 * 1024;
export const STORAGE_LIMIT_LABEL = "500 MB";

export type ProfileFile = Pick<
  FileType,
  "id" | "name" | "size" | "mime_type" | "is_shared" | "created_at"
>;

export interface ProfileSummary {
  fileCount: number;
  folderCount: number;
  sharedFileCount: number;
  sharedFilePercent: number;
  totalBytes: number;
  averageFileSize: number;
  usagePercent: number;
  usageLabel: string;
  remainingBytes: number;
  latestFileDate?: string;
  latestFiles: ProfileFile[];
}

function getUsageLabel(percent: number) {
  if (percent >= 90) return "정리가 필요해요";
  if (percent >= 70) return "넉넉하진 않아요";
  if (percent >= 35) return "안정적으로 사용 중";
  return "여유 공간 충분";
}

export function createProfileSummary(
  files: ProfileFile[],
  folderCount: number,
): ProfileSummary {
  const fileCount = files.length;
  const totalBytes = files.reduce(
    (total, file) => total + Number(file.size ?? 0),
    0,
  );
  const sharedFileCount = files.filter((file) => file.is_shared).length;
  const usagePercent = Math.min(
    Math.round((totalBytes / STORAGE_LIMIT_BYTES) * 100),
    100,
  );
  const latestFiles = files.slice(0, 5);

  return {
    fileCount,
    folderCount,
    sharedFileCount,
    sharedFilePercent:
      fileCount > 0 ? Math.round((sharedFileCount / fileCount) * 100) : 0,
    totalBytes,
    averageFileSize: fileCount > 0 ? totalBytes / fileCount : 0,
    usagePercent,
    usageLabel: getUsageLabel(usagePercent),
    remainingBytes: Math.max(STORAGE_LIMIT_BYTES - totalBytes, 0),
    latestFileDate: latestFiles[0]?.created_at,
    latestFiles,
  };
}
