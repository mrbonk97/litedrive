"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FileType } from "@/app/types";
import { Fragment } from "react";
import { useFolder } from "@/context/folder-context";
import Link from "next/link";

interface Props {
  folders: FileType[];
}

export function BreadCrumb({ folders }: Props) {
  const len = folders.length;
  const { state, dispatch, dragDrop } = useFolder();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {folders.map((f, idx) => {
          if (len == idx + 1) {
            return (
              <Fragment key={`breadcrumb-${f.ID}`}>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href={`/folders${f.ID === 0 ? "" : `/${f.ID}`}`}>{f.NAME}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Fragment>
            );
          }

          return (
            <Fragment key={`breadcrumb-${f.ID}`}>
              <BreadcrumbItem
                onDragOver={(e) => {
                  e.preventDefault();
                  dispatch({ type: "DRAG_OVER", file: f });
                }}
                onDrop={() => dragDrop(f)}
                className={`${
                  state.drag?.ID != f.ID && state.target?.ID == f.ID ? "outline-2 outline-dashed outline-rose-400 " : ""
                }`}
              >
                <BreadcrumbLink asChild>
                  <Link href={`/folders${f.ID === 0 ? "" : `/${f.ID}`}`}>{f.NAME}</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
