import { downloadFile } from "@/features/files/api/download-file.api";
import { prepareSharedFileDownload } from "@/features/files/api/file-transfer.api";

export async function downloadSharedFile(shareCode: string) {
  const prepared = await prepareSharedFileDownload(shareCode);

  if (prepared.error || !prepared.data) {
    throw new Error(prepared.error ?? "다운로드 준비에 실패했습니다.");
  }

  await downloadFile({
    type: "prepared",
    workerUrl: prepared.data.workerUrl,
    token: prepared.data.token,
    fileName: prepared.data.fileName,
    downloadUrl: prepared.data.downloadUrl,
  });
}
