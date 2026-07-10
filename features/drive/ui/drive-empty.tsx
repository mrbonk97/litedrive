import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FolderPlus } from "lucide-react";
import { UploadFileDialog } from "@/features/files/ui/upload-file.dialog";
import { CreateFolderDialog } from "@/features/folders/ui/create-folder.dialog";

export function DriveEmpty() {
  return (
    <Empty className="p-8 min-h-96 rounded-lg border lg:border-none">
      <EmptyHeader>
        <EmptyMedia variant="icon" className="stroke-rose-400">
          <FolderPlus />
        </EmptyMedia>
        <EmptyTitle>아직 파일이나 폴더가 없습니다</EmptyTitle>
        <EmptyDescription>
          파일을 업로드하거나 새 폴더를 만들어 드라이브를 정리해보세요.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent className="grid w-full grid-cols-1 sm:grid-cols-2 gap-2">
        <UploadFileDialog className="w-full" />
        <CreateFolderDialog className="w-full" />
      </EmptyContent>
    </Empty>
  );
}
