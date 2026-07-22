"use client";

import Image from "next/image";
import { FileType } from "@/types";
import { useState } from "react";
import { getIcon } from "@/lib/utils";
import { useDndStore } from "@/hooks/use-dnd-store";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { DeleteFileDialog } from "@/features/files/ui/delete-file-dialog";
import { RenameFileDialog } from "@/features/files/ui/rename-file-dialog";
import { ShareFileDialog } from "@/features/files/ui/share-file-dialog";
import { downloadFile } from "@/features/files/api/download-file.api";
import { toast } from "sonner";

interface Props {
  file: FileType;
}

type FileState = "IDLE" | "DELETE" | "RENAME" | "SHARE";

export function FileCard({ file }: Props) {
  const dnd = useDndStore();
  const [state, setState] = useState<FileState>("IDLE");
  const [isDownloading, setIsDownloading] = useState(false);
  const canDownload = file.upload_status === "success";

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
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <li
            draggable
            onDragStart={() =>
              dnd.dragStart({
                id: file.id,
                type: "file",
                parentId: file.folder_id,
              })
            }
            onDragEnd={() => dnd.dragEnd()}
            className="p-4 sm:w-32 h-32 rounded-lg hover:bg-secondary cursor-grab"
          >
            <Image
              src={getIcon(file.name)}
              alt={file.name}
              height={512}
              width={512}
              className="mx-auto h-14 w-14 object-contain"
            />
            <p className="mt-2 line-clamp-2 text-sm text-center break-all">
              {file.name}
            </p>
          </li>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuLabel>설정</ContextMenuLabel>
            <ContextMenuItem
              onSelect={() => setState("DELETE")}
              className="cursor-pointer"
            >
              삭제
            </ContextMenuItem>
            <ContextMenuItem
              onSelect={() => setState("RENAME")}
              className="cursor-pointer"
            >
              이름 변경
            </ContextMenuItem>
            <ContextMenuItem
              onSelect={() => setState("SHARE")}
              className="cursor-pointer"
            >
              파일 공유
            </ContextMenuItem>
            <ContextMenuItem
              disabled={isDownloading || !canDownload}
              onSelect={handleDownload}
              className="cursor-pointer"
            >
              {isDownloading ? "다운로드 중..." : "다운로드"}
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>

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
