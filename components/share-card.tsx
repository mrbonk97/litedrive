"use client";

import { File, FileLock2 } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Button } from "./ui/button";
import { useState } from "react";
import { safeAwait } from "@/lib/safe-await";
import { checkShareFile } from "@/services/file-service";
import { toast } from "sonner";
import { FileType } from "@/app/types";
import { convertByte } from "@/lib/utils";
import { Spinner } from "./spinner";

interface Props {
  defaultCode: string | undefined;
}

export function ShareCard({ defaultCode }: Props) {
  const [code, setCode] = useState(defaultCode ?? "");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<FileType | null>(null);

  const checkFile = async () => {
    if (code.length != 8) return;
    setError("");
    setIsSubmitting(true);
    const [data, error] = await safeAwait(checkShareFile(code));

    if (error) {
      setError(error.message);
      toast.error(error.message);
    }

    if (data) {
      setFile(data.file);
      console.log(data.file);
      toast.success(data.message);
    }

    setIsSubmitting(false);
  };

  if (file) {
    return (
      <section className="p-4 bg-background shadow-lg rounded-2xl">
        <h2 className="p-4 text-lg sm:text-2xl font-bold opacity-80 text-center">{file.NAME}</h2>
        <File className="mt-8 mx-auto text-rose-400" size={48} />
        <p className="mt-6 text-center text-lg font-medium opacity-80">
          {convertByte(file.SIZE_BYTES)}
        </p>
        <p className="mt-4 text-destructive text-center text-sm font-medium">{error}</p>
        <Button className="mt-24 w-full rounded-xl disabled:opacity-50" asChild>
          <a
            download
            href={`/api/download?code=${code}`}
            className="mt-24 w-full rounded-xl disabled:opacity-50"
          >
            파일 다운로드
          </a>
        </Button>
      </section>
    );
  }

  return (
    <section className="p-4 bg-background shadow-lg rounded-2xl">
      <h2 className="p-4 text-lg sm:text-2xl font-bold opacity-80 text-center">
        공유받은 코드를 입력해주세요
      </h2>
      <FileLock2 className="mt-8 mx-auto text-rose-400" size={48} />
      <div className="mt-4 mx-auto w-fit">
        <InputOTP maxLength={8} value={code} onChange={(v) => setCode(v)}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
            <InputOTPSlot index={6} />
            <InputOTPSlot index={7} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <p className="mt-4 text-destructive text-center text-sm font-medium">{error}</p>
      <Button
        onClick={checkFile}
        className="mt-24 w-full rounded-xl"
        disabled={code.length != 8 || isSubmitting}
      >
        {isSubmitting ? <Spinner /> : "파일 확인"}
      </Button>
    </section>
  );
}
