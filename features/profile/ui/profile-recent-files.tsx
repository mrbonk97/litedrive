import Image from "next/image";
import { CheckCircle2, FileText } from "lucide-react";
import type { ProfileFile } from "@/features/profile/model/profile-summary";
import { formatDate, formatFileSize, getIcon } from "@/lib/utils";

interface Props {
  files: ProfileFile[];
}

export function ProfileRecentFiles({ files }: Props) {
  return (
    <article className="col-span-4 lg:col-span-2 h-fit rounded-lg border p-4">
      <header>
        <p className="text-sm text-muted-foreground">최근 활동</p>
        <h2 className="mt-2 text-2xl font-semibold">최근 추가한 파일</h2>
      </header>
      <div className="mt-4 divide-y">
        {files.length > 0 ? (
          files.map((file) => <RecentFile key={file.id} file={file} />)
        ) : (
          <div className="grid min-h-56 place-items-center text-center">
            <div>
              <FileText className="mx-auto text-muted-foreground" />
              <p className="mt-4 font-medium">아직 추가한 파일이 없어요</p>
              <p className="mt-2 text-sm text-muted-foreground">
                파일을 업로드하면 최근 5개가 여기에 표시됩니다.
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function RecentFile({ file }: { file: ProfileFile }) {
  return (
    <div className="py-4 grid grid-cols-[auto_1fr_auto] items-center gap-4">
      <Image
        src={getIcon(file.name)}
        alt={file.name}
        height={512}
        width={512}
        className="p-2 h-12 w-12 bg-secondary rounded-lg"
      />
      <div className="min-w-0">
        <p className="truncate font-medium">{file.name}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {formatDate(file.created_at)} · {formatFileSize(Number(file.size))}
        </p>
      </div>
      {file.is_shared ? (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
          <CheckCircle2 size={14} />
          공유
        </span>
      ) : (
        <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
          비공개
        </span>
      )}
    </div>
  );
}
