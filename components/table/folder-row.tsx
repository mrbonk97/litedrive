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
import { useFolder } from "@/context/folder-context";
import { FolderDeleteModal } from "@/components/modal/folder-delete-modal";
import { FolderUpdateModal } from "@/components/modal/folder-update-modal";
import { updateFolderAction } from "@/actions/folder-action-client";
import { updateFileAction } from "@/actions/file-action-client";
import { toast } from "sonner";
import { safeAwait } from "@/lib/safe-await";
import { useRouter } from "next/navigation";

interface Props {
  folder: FolderType;
}

type Status = "IDLE" | "DELETE_OPEN" | "UPDATE_OPEN";

export function FolderRow({ folder }: Props) {
  const context = useFolder();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("IDLE");

  const openModal = (status: Status) => {
    setStatus(status);
  };

  const closeModal = () => {
    setStatus("IDLE");
  };

  const handleDrop = async () => {
    const dragRow = context.state.drag;
    if (!dragRow) return;
    if (dragRow.id === folder.id) return;

    // folder → folder
    if (dragRow.type === "folder") {
      const [, error] = await safeAwait(
        updateFolderAction(dragRow.id!, { parentFolderId: folder.id })
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("수정 완료");
      setTimeout(() => router.refresh(), 150);
    }

    // file → folder
    if (dragRow.type === "file") {
      const [, error] = await safeAwait(
        updateFileAction(dragRow.id!, { folderId: folder.id })
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success("수정 완료");
      setTimeout(() => router.refresh(), 150);
    }
  };

  return (
    <>
      <tr
        draggable
        onDragStart={() => {
          context.dispatch({
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
          context.dispatch({
            type: "DRAG_OVER",
            row: {
              id: folder.id,
              parentId: folder.parentFolderId,
              type: "folder",
            },
          });
        }}
        onDrop={async (e) => {
          e.preventDefault();
          handleDrop();
        }}
        onDragEnd={() => {
          context.dispatch({ type: "DRAG_END" });
        }}
        className={`hover:bg-secondary border-b ${
          context.state.target?.id === folder.id
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
                context.state.target?.id === folder.id
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
