import { FileType, FolderType } from "@/types";
import { FileCard } from "@/features/drive/ui/file-card";
import { FolderCard } from "@/features/drive/ui/folder-card";

interface Props {
  folders: FolderType[];
  files: FileType[];
}

export function DriveGrid({ folders, files }: Props) {
  return (
    <ul className="p-4 grid sm:flex sm:flex-wrap grid-cols-3 gap-2 sm:gap-4">
      {folders.map((f) => (
        <FolderCard key={f.id} folder={f} />
      ))}
      {files.map((f) => (
        <FileCard key={f.id} file={f} />
      ))}
    </ul>
  );
}
