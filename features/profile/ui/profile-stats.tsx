import { Database, FileText, Folder, ShieldCheck } from "lucide-react";
import type { ProfileSummary } from "@/features/profile/model/profile-summary";
import { formatDate, formatFileSize } from "@/lib/utils";

interface Props {
  summary: ProfileSummary;
}

export function ProfileStats({ summary }: Props) {
  const stats = [
    {
      label: "전체 파일",
      value: summary.fileCount.toLocaleString("ko-KR"),
      description: summary.latestFileDate
        ? `최근 업로드 ${formatDate(summary.latestFileDate)}`
        : "아직 업로드 없음",
      icon: FileText,
    },
    {
      label: "폴더",
      value: summary.folderCount.toLocaleString("ko-KR"),
      description: "드라이브 정리 단위",
      icon: Folder,
    },
    {
      label: "공유 파일",
      value: summary.sharedFileCount.toLocaleString("ko-KR"),
      description:
        summary.fileCount > 0
          ? `전체의 ${summary.sharedFilePercent}%`
          : "공유된 파일 없음",
      icon: ShieldCheck,
    },
    {
      label: "평균 크기",
      value: formatFileSize(summary.averageFileSize),
      description: "파일당 평균 용량",
      icon: Database,
    },
  ];

  return stats.map((item) => {
    const Icon = item.icon;
    return (
      <article
        key={item.label}
        className="col-span-2 lg:col-span-1 rounded-lg p-4 ring-1 ring-foreground/10"
      >
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">{item.label}</p>
          <Icon size={20} className="text-rose-400" />
        </div>
        <p className="mt-4 text-2xl font-semibold">{item.value}</p>
        <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
      </article>
    );
  });
}
