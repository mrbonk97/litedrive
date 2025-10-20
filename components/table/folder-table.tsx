"use client";

import { FileType } from "@/app/types";
import { FolderTableRow } from "./folder-table-row";
import { Squirrel } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  files: FileType[];
}

export function FolderTable({ files }: Props) {
  const [colSpan, setColSpan] = useState(3);

  useEffect(() => {
    const updateColSpan = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) {
        setColSpan(6);
      } else if (window.matchMedia("(min-width: 768px)").matches) {
        setColSpan(5);
      } else {
        setColSpan(3);
      }
    };

    updateColSpan(); // 초기 1회 실행
    window.addEventListener("resize", updateColSpan);
    return () => window.removeEventListener("resize", updateColSpan);
  }, []);

  return (
    <table className="w-full text-left text-sm table-fixed">
      <thead className="z-40 sticky top-14">
        <tr className="border-b bg-secondary">
          <th className="p-2 font-normal">이름</th>
          <th className="p-2 w-32 font-normal hidden lg:table-cell">소유자</th>
          <th className="p-2 w-28 font-normal text-right hidden md:table-cell">수정한 날짜</th>
          <th className="p-2 w-16 font-normal text-center hidden md:table-cell">공유중</th>
          <th className="p-2 w-24 font-normal text-right">파일 크기</th>
          <th className="p-2 w-16 font-normal text-center">설정</th>
        </tr>
      </thead>
      <tbody>
        {files.length === 0 && (
          <tr>
            <td colSpan={colSpan}>
              <div className="mt-4 p-4 text-rose-400">
                <Squirrel className="mx-auto" size={48} />
                <p className="mt-2 text-center">파일이 없습니다.</p>
              </div>
            </td>
          </tr>
        )}

        {files.map((f) => (
          <FolderTableRow key={`row-${f.FILE_TYPE}-${f.ID}`} file={f} />
        ))}
      </tbody>
    </table>
  );
}
