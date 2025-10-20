export type UserType = {
  ID: number;
  USERNAME: string;
  PASSWORD: string;
  CREATED_AT: Date;
  UPDATED_AT: Date;
  DELETED_AT: Date | null;
};

export type FileType = {
  ID: number;
  USERNAME: string;
  FOLDER_ID: number | null;
  PARENT_FOLDER_ID: number | null;
  NAME: string;
  SIZE_BYTES: number;
  CONTENT: string;
  CREATED_AT: string;
  UPDATED_AT: string;
  SHARE_CODE: string | null;
  FILE_TYPE: "FILE" | "FOLDER";
};

export type BreadCrumbType = {
  ID: string | null;
  NAME: string;
};
