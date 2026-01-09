"use client";

import { useState } from "react";
import Image from "next/image";
import { FileType } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Ellipsis } from "lucide-react";
import { safeAwait } from "@/lib/safe-await";
import { useFolder } from "@/context/folder-context";
import { formatSize, getFileIcon } from "@/lib/utils";
import { downloadFileAction } from "@/actions/file-action-client";
import { FileShareModal } from "@/components/modal/file-share-modal";
import { FileDeleteModal } from "@/components/modal/file-delete-modal";
import { FileUpdateModal } from "@/components/modal/file-update-modal";

interface Props {
  file: FileType;
}

type Status = "IDLE" | "DELETE_OPEN" | "UPDATE_OPEN" | "SHARE_OPEN";

export function FileRow({ file }: Props) {
  const context = useFolder();
  const [status, setStatus] = useState<Status>("IDLE");

  const openModal = (status: Status) => {
    setStatus(status);
  };

  const closeModal = () => {
    setStatus("IDLE");
  };

  const downloadFile = async () => {
    const [data, error] = await safeAwait(downloadFileAction(file.id));

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data) {
      window.open(data, "_self");
      toast.success("파일 다운로드가 시작되었습니다.");
    }
  };

  return (
    <>
      <tr
        draggable
        onDragStart={() =>
          context.dispatch({
            type: "DRAG_START",
            row: { id: file.id, parentId: null, type: "file" },
          })
        }
        onDragEnd={() => context.dispatch({ type: "DRAG_END" })}
        className={`hover:bg-secondary border-b [&>tr]:last:border-b-0`}
      >
        <td
          onClick={downloadFile}
          className="p-2 w-full shrink flex items-center gap-2 underline-offset-2 hover:underline cursor-pointer"
        >
          <Image
            src={getFileIcon(file.name.split(".")[1])}
            height={24}
            width={24}
            alt="icon"
            className="shrink-0"
          />
          <div className="w-full truncate">{file.name}</div>
        </td>
        <td className="p-2 hidden lg:table-cell">{file.ownerName}</td>
        <td className="p-2 text-right hidden md:table-cell">
          {file.createdAt.substring(0, 10)}
        </td>
        <td className="p-2 text-center hidden md:table-cell">
          {file.share ? "O" : "X"}
        </td>
        <td className="p-2 text-right">{formatSize(file.size)}</td>
        <td className="p-2">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="w-full cursor-pointer">
              <span className="sr-only">메뉴 열기</span>
              <Ellipsis className="mx-auto" size={18} opacity={0.8} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>메뉴</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => openModal("UPDATE_OPEN")}
                className="cursor-pointer"
              >
                이름변경
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openModal("SHARE_OPEN")}
                className="cursor-pointer"
              >
                {file.share ? "공유중지" : "공유하기"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => openModal("DELETE_OPEN")}
                className="cursor-pointer"
              >
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
      <FileUpdateModal
        isOpen={status === "UPDATE_OPEN"}
        file={file}
        close={closeModal}
      />
      <FileShareModal
        isOpen={status === "SHARE_OPEN"}
        file={file}
        close={closeModal}
      />
      <FileDeleteModal
        isOpen={status === "DELETE_OPEN"}
        file={file}
        close={closeModal}
      />
    </>
  );
}
