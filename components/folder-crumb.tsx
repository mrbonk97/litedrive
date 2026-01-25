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
import { useDnd } from "@/hooks/use-dnd";
import { BreadCrumbType } from "@/types";

interface Props {
  breadCrumb: BreadCrumbType[];
}
export function FolderCrumb({ breadCrumb }: Props) {
  const dnd = useDnd();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem
          onDragOver={(e) => {
            e.preventDefault();
            dnd.dispatch({
              type: "DRAG_OVER",
              row: { id: null, parentId: null, type: "folder" },
            });
          }}
          onDrop={(e) => {
            e.preventDefault();
            dnd.drop();
          }}
          className={
            dnd.state.target?.id === null
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
                  dnd.dispatch({
                    type: "DRAG_OVER",
                    row: { id: null, parentId: null, type: "folder" },
                  });
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  dnd.drop();
                }}
                className={
                  dnd.state.target?.id === folder.id
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
