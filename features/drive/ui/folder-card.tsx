"use client";

import Link from "next/link";
import { useState } from "react";
import { FolderType } from "@/types";
import { useDndStore } from "@/hooks/use-dnd-store";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Folder, FolderOpen } from "lucide-react";
import { DeleteFolderDialog } from "@/features/folders/ui/delete-folder-dialog";
import { RenameFolderDialog } from "@/features/folders/ui/rename-folder-dialog";

interface Props {
  folder: FolderType;
}

type FolderState = "IDLE" | "DELETE" | "RENAME";

export function FolderCard({ folder }: Props) {
  const dnd = useDndStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState<FolderState>("IDLE");

  const isDropTarget = dnd.dropTarget?.id === folder.id;

  const queryString = searchParams.toString();
  const folderHref = queryString
    ? `/folders/${folder.id}?${queryString}`
    : `/folders/${folder.id}`;

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <li
            draggable
            onDragStart={() =>
              dnd.dragStart({
                id: folder.id,
                type: "folder",
                parentId: folder.parent_id,
              })
            }
            onDragEnd={() => dnd.dragEnd()}
            onDragEnter={(event) => {
              event.preventDefault();

              dnd.dragEnter({
                id: folder.id,
                type: "folder",
              });
            }}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";

              dnd.dragEnter({
                id: folder.id,
                type: "folder",
              });
            }}
            onDragLeave={() => dnd.dragLeave()}
            onDrop={(event) => {
              event.preventDefault();

              void dnd.dropOnFolder(
                {
                  id: folder.id,
                  type: "folder",
                },
                () => router.refresh(),
              );
            }}
          >
            <Link
              href={folderHref}
              className={`block p-4 sm:w-32 h-32 cursor-grab rounded-lg transition-colors hover:bg-secondary
                ${isDropTarget ? "bg-rose-50 outline-2 -outline-offset-2 outline-rose-400 outline-dashed" : ""}
              `}
            >
              {isDropTarget ? (
                <FolderOpen
                  size={48}
                  className="mt-2 mx-auto fill-yellow-400 stroke-yellow-300"
                />
              ) : (
                <Folder
                  size={48}
                  className="mt-2 mx-auto fill-yellow-400 stroke-yellow-400"
                />
              )}

              <p className="mt-2 line-clamp-2 text-sm text-center break-all">
                {folder.name}
              </p>
            </Link>
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
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>

      <DeleteFolderDialog
        open={state === "DELETE"}
        onOpenChange={() => setState("IDLE")}
        folder={folder}
      />

      <RenameFolderDialog
        open={state === "RENAME"}
        onOpenChange={() => setState("IDLE")}
        folder={folder}
      />
    </>
  );
}
