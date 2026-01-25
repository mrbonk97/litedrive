export type CreateFolderPayload = {
  name: string;
  parentFolderId: string | null;
};

export type GetFolderPayload = {
  id: string | null;
  q: string | null;
  filter: string | null;
};

export type UpdateFolderPayload = {
  id: string;
  parentFolderId?: string | null;
  name?: string;
};

export type DeleteFolderPayload = {
  id: string;
};
