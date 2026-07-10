import { prepareFileDownload } from "@/features/files/api/file-transfer.api";

type DownloadSource =
  | {
      type: "file";
      fileId: string;
    }
  | {
      type: "prepared";
      workerUrl: string;
      token: string;
      fileName: string;
      downloadUrl?: string;
    };

function downloadFromUrl(url: string, fileName: string) {
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;
  anchor.target = "_blank";
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export async function downloadFile(source: DownloadSource) {
  const prepared =
    source.type === "file"
      ? await prepareFileDownload(source.fileId)
      : {
          data: {
            workerUrl: source.workerUrl,
            token: source.token,
            fileName: source.fileName,
            downloadUrl: source.downloadUrl,
          },
          error: null,
        };

  if (prepared.error || !prepared.data) {
    throw new Error(prepared.error ?? "다운로드 준비에 실패했습니다.");
  }

  if (prepared.data.downloadUrl) {
    downloadFromUrl(prepared.data.downloadUrl, prepared.data.fileName);
    return;
  }

  const response = await fetch(prepared.data.workerUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${prepared.data.token}`,
    },
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const url = URL.createObjectURL(await response.blob());

  try {
    downloadFromUrl(url, prepared.data.fileName);
  } finally {
    URL.revokeObjectURL(url);
  }
}
