export interface FolderType {
  id: string;
  name: string;
  ownerId: string;
  ownerName: string;
  parentFolderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileType {
  id: string;
  name: string;
  type: string;
  size: number;
  ownerId: string;
  folderId: string | null;
  share: boolean;
  uploadStatus: UploadStatusType;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface RowType {
  id: string | null;
  parentId: string | null;
  type: "file" | "folder";
}

export interface BreadCrumbType {
  id: string;
  name: string;
}

export type UploadStatusType = "pending" | "success" | "failed";
