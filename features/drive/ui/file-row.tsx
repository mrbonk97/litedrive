"use client";

import Image from "next/image";
import { useState } from "react";
import { FileType } from "@/types";
import { useDndStore } from "@/hooks/use-dnd-store";
import { formatDate, formatFileSize, getIcon } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { ShareFileDialog } from "@/features/files/ui/share-file.dialog";
import { RenameFileDialog } from "@/features/files/ui/rename-file-dialog";
import { DeleteFileDialog } from "@/features/files/ui/delete-file.dialog";
import { downloadFile } from "@/features/files/api/download-file.api";
import { toast } from "sonner";

interface Props {
  file: FileType;
}

type FileState = "IDLE" | "DELETE" | "RENAME" | "SHARE";

export function FileRow({ file }: Props) {
  const dnd = useDndStore();
  const [state, setState] = useState<FileState>("IDLE");
  const [isDownloading, setIsDownloading] = useState(false);
  const canDownload = file.upload_status === "success";
  const statusText =
    file.upload_status === "pending"
      ? "업로드 중"
      : file.upload_status === "fail"
        ? "업로드 실패"
        : file.is_shared
          ? "공유"
          : "비공개";

  async function handleDownload() {
    if (isDownloading || !canDownload) return;

    setIsDownloading(true);

    try {
      await downloadFile({ type: "file", fileId: file.id });
    } catch (error) {
      console.error(error);
      toast.error("파일 다운로드에 실패했습니다.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <>
      <tr
        draggable
        onDragStart={() =>
          dnd.dragStart({
            id: file.id,
            type: "file",
            parentId: file.folder_id,
          })
        }
        onDragEnd={() => dnd.dragEnd()}
        onClick={handleDownload}
        className={`border-b ${canDownload ? "cursor-pointer hover:bg-secondary" : "cursor-not-allowed opacity-70"}`}
      >
        <td className="p-2  max-w-1 not-last:border-r">
          <div className="flex items-center gap-2">
            <Image
              src={getIcon(file.name)}
              alt={file.name}
              height={512}
              width={512}
              className="h-5 w-5 object-contain"
            />
            <p className="text-sm truncate">{file.name}</p>
          </div>
        </td>
        <td className="hidden lg:table-cell p-2 text-sm not-last:border-r">
          {file.user_id.substring(0, 8)}
        </td>
        <td className="hidden sm:table-cell p-2 text-sm text-right not-last:border-r">
          {formatDate(file.created_at)}
        </td>
        <td className="hidden xl:table-cell p-2 text-sm text-right not-last:border-r">
          {formatDate(file.updated_at)}
        </td>
        <td className="hidden sm:table-cell p-2 text-sm text-right not-last:border-r">
          {formatFileSize(file.size)}
        </td>
        <td className="hidden md:table-cell p-2 text-sm text-muted-foreground text-center not-last:border-r">
          {statusText}
        </td>
        <td
          className="p-2 not-last:border-r"
          onClick={(event) => event.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger className="block ml-auto w-fit cursor-pointer">
              <Ellipsis size={20} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>설정</DropdownMenuLabel>
                <DropdownMenuItem
                  onSelect={() => setState("DELETE")}
                  className="cursor-pointer"
                >
                  삭제
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setState("RENAME")}
                  className="cursor-pointer"
                >
                  이름 변경
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setState("SHARE")}
                  className="cursor-pointer"
                >
                  파일 공유
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={isDownloading || !canDownload}
                  onSelect={handleDownload}
                  className="cursor-pointer"
                >
                  {isDownloading ? "다운로드 중..." : "다운로드"}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
      <DeleteFileDialog
        open={state == "DELETE"}
        onOpenChange={() => setState("IDLE")}
        file={file}
      />
      <RenameFileDialog
        open={state == "RENAME"}
        onOpenChange={() => setState("IDLE")}
        file={file}
      />
      <ShareFileDialog
        open={state == "SHARE"}
        onOpenChange={() => setState("IDLE")}
        file={file}
      />
    </>
  );
}
