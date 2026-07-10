"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { cn, getIcon } from "@/lib/utils";
import { Download } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { getSharedFile, type SharedFile } from "../api/get-share-file.api";
import { downloadSharedFile } from "../api/download-share-file.api";

interface Props {
  defaultCode?: string;
  className?: string;
}

type Status = "IDLE" | "CHECKING" | "FOUND" | "NOT-FOUND" | "ERROR";

export function ShareTokenForm({ defaultCode = "", className }: Props) {
  const [code, setCode] = useState(defaultCode.trim());
  const [file, setFile] = useState<SharedFile | null>(null);
  const [status, setStatus] = useState<Status>("IDLE");
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const token = code.trim();

    if (token.length !== 8 && token.length !== 16) return;

    let active = true;

    async function checkShareToken() {
      setFile(null);
      setStatus("CHECKING");

      const { data, error } = await getSharedFile(token);

      if (!active) return;
      if (error) {
        console.error(error);
        setStatus("ERROR");
        toast.error(error);
        return;
      }

      if (!data) {
        setStatus("NOT-FOUND");
        return;
      }

      setFile(data);
      setStatus("FOUND");
    }

    void checkShareToken();
    return () => {
      active = false;
    };
  }, [code]);

  async function handleDownload() {
    if (!file) return;

    try {
      setIsDownloading(true);
      await downloadSharedFile(code);
    } catch (error) {
      console.error(error);
      toast.error("파일 다운로드에 실패했습니다.");
    } finally {
      setIsDownloading(false);
    }
  }

  const canDownload = status === "FOUND" && !!file && !isDownloading;

  return (
    <section
      className={cn(
        "mt-4 p-4 sm:p-8 w-full rounded-lg bg-background sm:shadow-lg",
        className,
      )}
    >
      <header className="text-center">
        <div className="mx-auto p-2 w-fit rounded-full bg-rose-100">
          <Download size={32} className="stroke-rose-400" />
        </div>

        <h1 className="mt-4 text-2xl font-bold">파일 다운로드</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          공유받은 코드를 입력하면 파일을 다운로드할 수 있습니다.
        </p>
      </header>

      <form
        className="mt-8"
        onSubmit={(event) => {
          event.preventDefault();
          handleDownload();
        }}
      >
        <InputOTP
          maxLength={16}
          value={code}
          containerClassName="flex-col gap-2"
          onChange={(nextCode) => {
            setCode(nextCode);

            if (nextCode.trim().length !== 8 && nextCode.trim().length !== 16) {
              setFile(null);
              setStatus("IDLE");
            }
          }}
        >
          <InputOTPGroup className="mx-auto">
            {Array.from({ length: 8 }).map((_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>

          <InputOTPGroup className="mx-auto">
            {Array.from({ length: 8 }).map((_, index) => {
              const slotIndex = index + 8;

              return <InputOTPSlot key={slotIndex} index={slotIndex} />;
            })}
          </InputOTPGroup>
        </InputOTP>

        <div className="mt-4 min-h-24 flex items-center justify-center">
          {status === "CHECKING" && <Spinner />}

          {status === "NOT-FOUND" && (
            <p className="text-center text-sm text-destructive">
              유효하지 않거나 만료된 공유 코드입니다.
            </p>
          )}

          {status === "ERROR" && (
            <p className="text-center text-sm text-destructive">
              잠시 후 다시 시도해주세요.
            </p>
          )}

          {file && (
            <div className="flex items-center gap-4 rounded-lg bg-secondary p-4">
              <Image
                src={getIcon(file.name)}
                alt={file.name}
                width={512}
                height={512}
                className="p-4 h-16 w-16 rounded-lg bg-background"
              />

              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 break-all text-sm font-medium">
                  {file.name}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  다운로드 가능한 파일입니다.
                </p>
              </div>
            </div>
          )}
        </div>

        <Button type="submit" disabled={!canDownload} className="mt-4 w-full">
          {isDownloading ? "다운로드 중..." : "파일 다운로드"}
        </Button>
      </form>
    </section>
  );
}
