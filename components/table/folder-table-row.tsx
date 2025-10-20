"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { FileType } from "@/app/types";
import { convertByte, getFileIcon } from "@/lib/utils";
import Image from "next/image";
import { useFolder } from "@/context/folder-context";
import Link from "next/link";
import { FileShareModal } from "@/components/modal/file-share-modal";
import { FileDeleteModal } from "@/components/modal/file-delete-modal";
import { FileUpdateModal } from "@/components/modal/file-update-modal";
import { FolderDeleteModal } from "@/components/modal/folder-delete-modal";
import { FolderUpdateModal } from "@/components/modal/folder-update-modal";
import { useState } from "react";

interface Props {
  file: FileType;
}

type Status = "IDLE" | "DELETE_OPEN" | "UPDATE_OPEN" | "SHARE_OPEN";

export function FolderTableRow({ file }: Props) {
  const { state, dispatch, dragDrop } = useFolder();
  const [status, setStatus] = useState<Status>("IDLE");

  const openModal = (status: Status) => {
    setStatus(status);
  };

  const closeModal = () => {
    setStatus("IDLE");
  };

  let icon = "/static/icons/069-open-folder.svg";
  if (file.FILE_TYPE === "FILE") {
    const split = file.NAME.split(".");
    const extension = split[split.length - 1];
    icon = getFileIcon(extension);
  }

  return (
    <>
      <tr
        draggable
        onDragStart={() => dispatch({ type: "DRAG_START", file: file })}
        onDragOver={(e) => {
          e.preventDefault();
          dispatch({ type: "DRAG_OVER", file: file });
        }}
        onDragEnd={() => dispatch({ type: "DRAG_END" })}
        onDrop={() => dragDrop(file)}
        className={`hover:bg-secondary border-b [&>tr]:last:border-b-0 ${
          state.target?.FILE_TYPE == file.FILE_TYPE && state.target?.ID == file.ID
            ? "relative z-50 outline-2 outline-dashed outline-rose-400"
            : ""
        }`}
      >
        <td>
          <Link
            download={file.FILE_TYPE === "FILE" ? "true" : undefined}
            target={file.FILE_TYPE === "FILE" ? "_blank" : undefined}
            rel={file.FILE_TYPE === "FILE" ? "noopener noreferrer" : undefined}
            href={file.FILE_TYPE === "FILE" ? `/api/files/${file.ID}` : `/folders/${file.ID}`}
            className="p-2 w-full shrink flex items-center gap-2 underline-offset-2 hover:underline"
          >
            <Image src={icon} height={24} width={24} alt="icon" className="shrink-0" />
            <div className="w-full truncate">{file.NAME}</div>
          </Link>
        </td>
        <td className="p-2 hidden lg:table-cell">{file.USERNAME}</td>
        <td className="p-2 text-right hidden md:table-cell">{file.UPDATED_AT.substring(0, 10)}</td>
        <td className="p-2 text-center hidden md:table-cell">{file.SHARE_CODE ? "O" : "X"}</td>
        <td className="p-2 text-right">{convertByte(file.SIZE_BYTES)}</td>
        <td className="p-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <span className="sr-only">메뉴 열기</span>
              <Ellipsis className="mx-auto" size={18} opacity={0.8} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>메뉴</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {file.FILE_TYPE === "FILE" && (
                <DropdownMenuItem onClick={() => openModal("SHARE_OPEN")}>
                  {file.SHARE_CODE ? "공유중지" : "공유하기"}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => openModal("UPDATE_OPEN")}>이름변경</DropdownMenuItem>
              <DropdownMenuItem onClick={() => openModal("DELETE_OPEN")}>삭제</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
      <FileShareModal isOpen={status === "SHARE_OPEN" && file.FILE_TYPE === "FILE"} file={file} close={closeModal} />
      <FileDeleteModal isOpen={status === "DELETE_OPEN" && file.FILE_TYPE === "FILE"} file={file} close={closeModal} />
      <FileUpdateModal isOpen={status === "UPDATE_OPEN" && file.FILE_TYPE === "FILE"} file={file} close={closeModal} />
      <FolderDeleteModal
        isOpen={status === "DELETE_OPEN" && file.FILE_TYPE === "FOLDER"}
        folder={file}
        close={closeModal}
      />
      <FolderUpdateModal
        isOpen={status === "UPDATE_OPEN" && file.FILE_TYPE === "FOLDER"}
        folder={file}
        close={closeModal}
      />
    </>
  );
}
