"use client";

import Link from "next/link";
import { useState } from "react";
import { FolderWithAuthorType } from "@/types";
import { formatDate } from "@/lib/utils";
import { useDndStore } from "@/hooks/use-dnd-store";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Ellipsis, Folder, FolderOpen } from "lucide-react";
import { DeleteFolderDialog } from "@/features/folders/ui/delete-folder-dialog";
import { RenameFolderDialog } from "@/features/folders/ui/rename-folder-dialog";

interface Props {
  folder: FolderWithAuthorType;
}

type FolderState = "IDLE" | "DELETE" | "RENAME";

export function FolderRow({ folder }: Props) {
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
          <tr
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
            className={`transition-colors border-b
              ${isDropTarget ? "bg-rose-50 outline-2 -outline-offset-2 outline-rose-400 outline-dashed" : ""}`}
          >
        <td className="p-2 max-w-1 not-last:border-r">
          <Link
            href={folderHref}
            className="flex items-center gap-2 underline-offset-2 hover:underline"
          >
            {isDropTarget ? (
              <FolderOpen
                size={48}
                className="h-5 w-5 shrink-0 fill-yellow-400 stroke-yellow-300"
              />
            ) : (
              <Folder
                size={48}
                className="h-5 w-5 shrink-0 fill-yellow-400 stroke-yellow-400"
              />
            )}

            <p className="text-sm truncate">{folder.name}</p>
          </Link>
        </td>

        <td className="hidden lg:table-cell p-2 text-left text-sm not-last:border-r">
          {folder.author?.username ?? "알 수 없음"}
        </td>

        <td className="p-2 hidden sm:table-cell text-sm text-right not-last:border-r">
          {formatDate(folder.created_at)}
        </td>

        <td className="hidden xl:table-cell p-2 text-right text-sm text-foreground not-last:border-r">
          {formatDate(folder.updated_at)}
        </td>

        <td className="hidden sm:table-cell p-2 not-last:border-r" />
        <td className="hidden md:table-cell p-2 not-last:border-r" />

        <td className="p-2 not-last:border-r">
          <DropdownMenu>
            <DropdownMenuTrigger className="ml-auto block w-fit cursor-pointer">
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
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
          </tr>
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
