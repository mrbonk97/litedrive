"use client";

import { FolderType } from "@/types";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { FolderDeleteModal } from "@/components/modal/folder-delete-modal";
import { FolderUpdateModal } from "@/components/modal/folder-update-modal";
import { useDnd } from "@/hooks/use-dnd";

interface Props {
  folder: FolderType;
}

type Status = "IDLE" | "DELETE_OPEN" | "UPDATE_OPEN";

export function FolderRow({ folder }: Props) {
  const dnd = useDnd();
  const [status, setStatus] = useState<Status>("IDLE");

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
            row: {
              id: folder.id,
              parentId: folder.parentFolderId,
              type: "folder",
            },
          });
        }}
        onDragOver={(e) => {
          e.preventDefault();
          dnd.dispatch({
            type: "DRAG_OVER",
            row: {
              id: folder.id,
              parentId: folder.parentFolderId,
              type: "folder",
            },
          });
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          dnd.dispatch({
            type: "DRAG_OVER",
            row: null,
          });
        }}
        onDrop={async (e) => {
          e.preventDefault();
          dnd.drop();
        }}
        className={`hover:bg-secondary border-b ${
          dnd.state.target?.id === folder.id
            ? "relative z-50 outline-2 outline-dashed outline-rose-400"
            : ""
        }`}
      >
        <td>
          <Link
            href={`/folders/${folder.id}`}
            className="p-2 w-full shrink flex items-center gap-2 underline-offset-2 hover:underline"
          >
            <Image
              src={
                dnd.state.target?.id === folder.id
                  ? "/static/icons/069-open-folder.svg"
                  : "/static/icons/001-folder.svg"
              }
              height={24}
              width={24}
              alt="icon"
              className="shrink-0"
            />
            <div className="w-full truncate">{folder.name}</div>
          </Link>
        </td>
        <td className="p-2 hidden lg:table-cell">{folder.ownerName}</td>
        <td className="p-2 text-right hidden md:table-cell">
          {folder.createdAt.substring(0, 10)}
        </td>
        <td className="p-2 text-center hidden md:table-cell">-</td>
        <td className="p-2 text-right">-</td>
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
                onClick={() => openModal("DELETE_OPEN")}
                className="cursor-pointer"
              >
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
      <FolderDeleteModal
        isOpen={status === "DELETE_OPEN"}
        folder={folder}
        close={closeModal}
      />
      <FolderUpdateModal
        isOpen={status === "UPDATE_OPEN"}
        folder={folder}
        close={closeModal}
      />
    </>
  );
}
