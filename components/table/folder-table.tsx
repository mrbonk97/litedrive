import { FileType, FolderType } from "@/types";
import { FolderRow } from "@/components/table/folder-row";
import { FileRow } from "@/components/table/file-row";

interface Props {
  files: FileType[];
  folders: FolderType[];
}

export function FolderTable({ files, folders }: Props) {
  return (
    <table className="w-full text-left text-sm table-fixed">
      <thead className="z-40 sticky top-14">
        <tr className="border-b bg-secondary">
          <th className="p-2 font-normal">이름</th>
          <th className="p-2 w-32 font-normal hidden lg:table-cell">소유자</th>
          <th className="p-2 w-28 font-normal text-right hidden md:table-cell">
            수정한 날짜
          </th>
          <th className="p-2 w-16 font-normal text-center hidden md:table-cell">
            공유중
          </th>
          <th className="p-2 w-24 font-normal text-right">파일 크기</th>
          <th className="p-2 w-16 font-normal text-center">설정</th>
        </tr>
      </thead>
      <tbody>
        {folders.map((folder) => (
          <FolderRow key={`folder-${folder.id}`} folder={folder} />
        ))}
        {files.map((file) => (
          <FileRow key={`file-${file.id}`} file={file} />
        ))}
      </tbody>
    </table>
  );
}
