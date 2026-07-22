export type FolderType = {
  id: string;
  user_id: string;
  parent_id: string | null;
  name: string;
  created_at: string;
  updated_at: string;
};

export type AuthorType = {
  username: string;
};

export type FolderWithAuthorType = FolderType & {
  author: AuthorType | null;
};

export type FileType = {
  id: string;
  user_id: string;
  folder_id: string | null;
  name: string;
  size: number;
  mime_type: string;
  storage_path: string;
  upload_status: "pending" | "success" | "fail";
  is_shared: boolean;
  share_token: string | null;
  auto_delete_at: string | null;
  created_at: string;
  updated_at: string;
};

export type FileWithAuthorType = FileType & {
  author: AuthorType | null;
};
