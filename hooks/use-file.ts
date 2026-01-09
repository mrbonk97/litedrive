"use client";

import { ChangeEvent, DragEvent, useState } from "react";
import { toast } from "sonner";

const MAX_SIZE = 10 * 1024 * 1024;

export function useFiles() {
  const [files, setFiles] = useState<File[]>([]);

  const appendFiles = (newFiles: File[]) => {
    const isSizeOver = newFiles.some((f) => f.size > MAX_SIZE);

    if (isSizeOver) {
      toast.error("10MB를 초과했습니다.");
      return;
    }

    const filteredFiles = newFiles.filter((f1) =>
      files.every((f2) => f1.name !== f2.name)
    );

    setFiles((cur) => [...filteredFiles, ...cur]);
  };

  const handleAdd = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    appendFiles(Array.from(e.target.files));
  };

  const handleDrop = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    appendFiles(Array.from(e.dataTransfer.files));
  };

  const removeFile = (target: File) => {
    setFiles((cur) => cur.filter((f) => f !== target));
  };

  const reset = () => setFiles([]);

  return { files, handleAdd, handleDrop, removeFile, reset };
}
