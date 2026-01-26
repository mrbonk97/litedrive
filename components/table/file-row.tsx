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
import { formatSize, getFileIcon } from "@/lib/utils";
import { FileShareModal } from "@/components/modal/file-share-modal";
import { FileDeleteModal } from "@/components/modal/file-delete-modal";
import { FileUpdateModal } from "@/components/modal/file-update-modal";
import { useDnd } from "@/hooks/use-dnd";
import { useMutation } from "@tanstack/react-query";
import { DownloadFilePayload } from "@/client/api/file.type";
import { downloadFile } from "@/client/api/file.api";

interface Props {
  file: FileType;
}

type Status = "IDLE" | "DELETE_OPEN" | "UPDATE_OPEN" | "SHARE_OPEN";

export function FileRow({ file }: Props) {
  const dnd = useDnd();
  const [status, setStatus] = useState<Status>("IDLE");

  const { mutate } = useMutation({
    mutationFn: (payload: DownloadFilePayload) => downloadFile(payload),
    onSuccess: (data) => {
      toast.success("파일 다운로드가 시작되었습니다.");
      window.open(data.url, "_self");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const openModal = (status: Status) => {
    setStatus(status);
  };

  const closeModal = () => {
    setStatus("IDLE");
  };

  return (
    <>
      <tr
        draggable
        onDragStart={() => {
          dnd.dispatch({
            type: "DRAG_START",
            row: { id: file.id, parentId: null, type: "file" },
          });
        }}
        onDragEnd={() => dnd.dispatch({ type: "RESET" })}
        className={`hover:bg-secondary border-b [&>tr]:last:border-b-0`}
      >
        <td
          onClick={() => mutate({ id: file.id })}
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
