import { FileType, FolderType } from "@/types";
import { FileRow } from "@/features/drive/ui/file-row";
import { FolderRow } from "@/features/drive/ui/folder-row";

interface Props {
  folders: FolderType[];
  files: FileType[];
}

export function DriveTable({ folders, files }: Props) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="p-2 text-sm font-normal not-last:border-r text-left">
            이름
          </th>
          <th className="p-2 hidden lg:table-cell w-32 text-sm font-normal not-last:border-r text-left">
            작성자
          </th>
          <th className="p-2 hidden sm:table-cell w-32 text-sm font-normal not-last:border-r text-right">
            등록일
          </th>
          <th className="p-2 hidden xl:table-cell w-32 text-sm font-normal not-last:border-r text-right">
            수정일
          </th>
          <th className="p-2 hidden sm:table-cell w-32 text-sm font-normal not-last:border-r text-right">
            용량
          </th>
          <th className="p-2 hidden md:table-cell w-16 text-sm font-normal not-last:border-r text-center">
            공유
          </th>
          <th className="p-2 w-16 text-sm font-normal not-last:border-r text-right">
            수정
          </th>
        </tr>
      </thead>
      <tbody className="p-4 min-h-svh">
        {folders.map((f) => (
          <FolderRow key={f.id} folder={f} />
        ))}
        {files.map((f) => (
          <FileRow key={f.id} file={f} />
        ))}
      </tbody>
    </table>
  );
}
