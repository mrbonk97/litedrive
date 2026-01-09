"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";
import { BreadCrumbType } from "@/types";
import { useFolder } from "@/context/folder-context";
import { safeAwait } from "@/lib/safe-await";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateFileAction } from "@/actions/file-action-client";
import { updateFolderAction } from "@/actions/folder-action-client";

interface Props {
  breadCrumb: BreadCrumbType[];
}
export function FolderCrumb({ breadCrumb }: Props) {
  const router = useRouter();
  const context = useFolder();

  const handleDrop = async (folderId: string | null) => {
    const dragRow = context.state.drag;
    if (!dragRow) return;
    if (dragRow.id === folderId) return;
    if (dragRow.type === "folder" && dragRow.parentId === folderId) return;

    // folder → folder
    if (dragRow.type === "folder") {
      const [, error] = await safeAwait(
        updateFolderAction(dragRow.id!, { parentFolderId: folderId })
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
        updateFileAction(dragRow.id!, { folderId: folderId })
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
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem
          onDragOver={(e) => {
            e.preventDefault();
            context.dispatch({
              type: "DRAG_OVER",
              row: { id: null, parentId: null, type: "folder" },
            });
          }}
          onDragEnd={() => {
            context.dispatch({ type: "DRAG_END" });
          }}
          onDrop={(e) => {
            e.preventDefault();
            handleDrop(null);
          }}
          className={
            context.state.target?.id === null
              ? "relative z-50 outline-2 outline-dashed outline-rose-400"
              : ""
          }
        >
          {breadCrumb.length === 0 ? (
            <BreadcrumbPage>홈</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href="/folders">홈</BreadcrumbLink>
          )}
        </BreadcrumbItem>

        {breadCrumb.map((folder, index) => {
          const isLast = index === breadCrumb.length - 1;

          return (
            <React.Fragment key={`bc-${folder.id}`}>
              <BreadcrumbSeparator />
              <BreadcrumbItem
                onDragOver={(e) => {
                  e.preventDefault();
                  context.dispatch({
                    type: "DRAG_OVER",
                    row: { id: folder.id, parentId: null, type: "folder" },
                  });
                }}
                onDragEnd={() => {
                  context.dispatch({ type: "DRAG_END" });
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(folder.id);
                }}
                className={
                  context.state.target?.id === folder.id
                    ? "relative z-50 outline-2 outline-dashed outline-rose-400"
                    : ""
                }
              >
                {isLast ? (
                  <BreadcrumbPage key={`bc-${folder.id}`}>
                    {folder.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    key={`bc-${folder.id}`}
                    href={`/folders/${folder.id}`}
                  >
                    {folder.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
