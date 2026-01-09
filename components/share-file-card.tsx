"use client";

import { Logo } from "@/components/nav/logo";
import { Button } from "@/components/ui/button";
import { downloadSharedFileAction } from "@/actions/file-action-client";
import { safeAwait } from "@/lib/safe-await";
import { toast } from "sonner";
import Form from "next/form";
import { useState } from "react";
import { FileType } from "@/types";
import { formatSize, getFileIcon } from "@/lib/utils";
import Image from "next/image";
import { SubmitButton } from "./submit-button";

interface Props {
  code: string | undefined;
}

export function ShareFileCard({ code }: Props) {
  const [file, setFile] = useState<FileType | null>(null);

  const checkFile = async (formData: FormData) => {
    const _code = formData.get("code")?.toString();

    if (!_code) {
      toast.error("코드를 입력해주세요");
      return;
    }

    const [data, error] = await safeAwait(
      downloadSharedFileAction("check", _code)
    );

    if (error) {
      toast.error(error.message);
    }

    if (data) {
      setFile(data);
      toast.success("파일 조회 성공");
    }
  };

  const downloadFile = async () => {
    if (!file) return;

    const [data, error] = await safeAwait(
      downloadSharedFileAction("download", file.id)
    );

    if (error) {
      toast.error(error.message);
    }

    if (data) {
      window.open(data, "_self");
      toast.success("파일 다운로드가 시작되었습니다.");
    }
  };

  return (
    <section className="w-full max-w-96 bg-background rounded shadow-lg">
      <div className="p-8">
        <Logo />
        {file ? (
          <div className="mt-8">
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
            <p className="text-sm font-medium opacity-70">
              {formatSize(file.size)}
            </p>
            <Button className="mt-16 w-full" onClick={downloadFile}>
              다운로드
            </Button>
          </div>
        ) : (
          <Form action={checkFile}>
            <label
              htmlFor="code"
              className="mt-8 block text-sm font-medium opacity-70"
            >
              공유받은 코드를 입력해주세요
            </label>

            <input
              id="code"
              name="code"
              required
              className="mt-2 p-4 w-full border rounded"
              defaultValue={code}
            />
            <SubmitButton text="확인" className="mt-37.5 w-full" />
          </Form>
        )}
      </div>
    </section>
  );
}
