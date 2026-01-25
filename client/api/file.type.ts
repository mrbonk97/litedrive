export type DownloadFilePayload = {
  id: string;
};

export type UploadFilePayload = {
  folderId: string | null;
  file: File;
};

export type DeleteFilePayload = {
  id: string;
};

export type UpdateFilePayload = {
  id: string;
  name?: string | null;
  folderId?: string | null;
  share?: boolean | null;
  uploadStatus?: "pending" | "success" | "failed";
};

export type FindFileByCodePayload = {
  code: string;
};

export type DownloadFileByCodePayload = {
  code: string;
};
