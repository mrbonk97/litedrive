"use client";

import Link from "next/link";
import { Fragment } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FolderType } from "@/types";
import { useDndStore } from "@/hooks/use-dnd-store";

interface Props {
  breadcrumb: FolderType[];
}

export function FolderBreadcrumb({ breadcrumb }: Props) {
  const dnd = useDndStore();
  const router = useRouter();

  return (
    <Breadcrumb className="p-2 border-b">
      <BreadcrumbList>
        <BreadcrumbItem
          onDragEnter={(event) => {
            event.preventDefault();
            dnd.dragEnter({
              id: null,
              type: "folder",
            });
          }}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "move";
            dnd.dragEnter({
              id: null,
              type: "folder",
            });
          }}
          onDragLeave={() => dnd.dragLeave()}
          onDrop={(event) => {
            event.preventDefault();
            void dnd.dropOnFolder(
              {
                id: null,
                type: "folder",
              },
              () => router.refresh(),
            );
          }}
          className={`transition-colors
                  ${dnd.dropTarget && dnd.dropTarget.id == null ? "bg-rose-50 outline-2 outline-rose-400 outline-dashed" : ""}`}
        >
          <BreadcrumbLink asChild>
            <Link href={`/folders`}>홈</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumb.map((item, idx) => {
          const isDropTarget = dnd.dropTarget?.id === item.id;

          // 마지막 idx
          if (idx == breadcrumb.length - 1) {
            return (
              <Fragment key={`bc-${item.id}`}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="max-w-16 truncate">
                    {item.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </Fragment>
            );
          }

          return (
            <Fragment key={`bc-${item.id}`}>
              <BreadcrumbSeparator />
              <BreadcrumbItem
                onDragEnter={(event) => {
                  event.preventDefault();
                  dnd.dragEnter({
                    id: item.id,
                    type: "folder",
                  });
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                  event.dataTransfer.dropEffect = "move";
                  dnd.dragEnter({
                    id: item.id,
                    type: "folder",
                  });
                }}
                onDragLeave={() => dnd.dragLeave()}
                onDrop={(event) => {
                  event.preventDefault();
                  void dnd.dropOnFolder(
                    {
                      id: item.id,
                      type: "folder",
                    },
                    () => router.refresh(),
                  );
                }}
                className={`transition-colors
                  ${isDropTarget ? "bg-rose-50 outline-2 outline-rose-400 outline-dashed" : ""}`}
              >
                <BreadcrumbLink className="max-w-16 truncate" asChild>
                  <Link href={`/folders/${item.id}`}>{item.name}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
