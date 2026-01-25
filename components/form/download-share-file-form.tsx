"use client";

import { downloadFileByCode, findFileByCode } from "@/client/api/file.api";
import {
  DownloadFileByCodePayload,
  FindFileByCodePayload,
} from "@/client/api/file.type";
import { useMutation } from "@tanstack/react-query";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Spinner } from "../spinner";
import { FileType } from "@/types";
import Image from "next/image";
import { formatSize, getFileIcon } from "@/lib/utils";

interface Props {
  defaultCode: string | undefined;
}

export function DownloadShareFileForm({ defaultCode }: Props) {
  const [file, setFile] = useState<FileType | null>(null);

  const check = useMutation({
    mutationFn: (payload: FindFileByCodePayload) => findFileByCode(payload),
    onSuccess: (data) => {
      setFile(data.file);
      toast.success("파일을 확인했습니다.");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const download = useMutation({
    mutationFn: (payload: DownloadFileByCodePayload) =>
      downloadFileByCode(payload),
    onSuccess: (data) => {
      toast.success("파일 다운로드가 시작되었습니다.");
      window.open(data.url, "_self");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const code = formData.get("code")!.toString();
    check.mutate({ code });
  };

  if (!file) {
    return (
      <form onSubmit={handleSubmit}>
        <input
          id="code"
          name="code"
          required
          defaultValue={defaultCode}
          className="mt-4 p-4 w-full rounded border"
          placeholder="공유받은 코드를 입력해주세요"
        />
        <Button className="mt-32 w-full" type="submit">
          {check.isPending ? <Spinner /> : "확인"}
        </Button>
      </form>
    );
  }

  return (
    <div className="mt-4">
      <div className="p-4 bg-secondary">
        <Image
          src={getFileIcon(file.name.split(".")[1])}
          height={64}
          width={64}
          alt="icon"
          className="mt-4 mx-auto"
        />
      </div>
      <h2 className="mt-4 font-medium opacity-80">{file.name}</h2>
      <p className="text-sm font-medium opacity-70">{formatSize(file.size)}</p>
      <Button
        className="mt-4 w-full"
        onClick={() => download.mutate({ code: file.id })}
      >
        다운로드
      </Button>
    </div>
  );
}
