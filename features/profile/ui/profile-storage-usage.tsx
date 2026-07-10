import {
  STORAGE_LIMIT_LABEL,
  type ProfileSummary,
} from "@/features/profile/model/profile-summary";
import { formatFileSize } from "@/lib/utils";

interface Props {
  summary: ProfileSummary;
}

export function ProfileStorageUsage({ summary }: Props) {
  return (
    <article className="col-span-4 lg:col-span-2 p-4 rounded-lg border">
      <header>
        <p className="text-sm text-muted-foreground">총 사용량</p>
        <h2 className="mt-2 text-2xl font-semibold">
          {formatFileSize(summary.totalBytes)}
        </h2>
      </header>
      <div className="mt-8 grid place-items-center">
        <div
          className="grid size-52 place-items-center rounded-full"
          style={{
            background: `conic-gradient(#f43f5e ${summary.usagePercent * 3.6}deg, #f1f5f9 0deg)`,
          }}
          role="img"
          aria-label={`${STORAGE_LIMIT_LABEL} 중 ${summary.usagePercent}% 사용`}
        >
          <div className="grid size-40 place-items-center rounded-full bg-background text-center shadow-sm">
            <div>
              <p className="text-4xl font-semibold">{summary.usagePercent}%</p>
              <p className="mt-2 text-sm text-muted-foreground">
                {STORAGE_LIMIT_LABEL} 기준
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 grid gap-4 text-sm">
        <UsageRow label="사용 중" value={formatFileSize(summary.totalBytes)} />
        <UsageRow
          label="남은 용량"
          value={formatFileSize(summary.remainingBytes)}
        />
        <UsageRow label="전체 한도" value={STORAGE_LIMIT_LABEL} />
      </div>
    </article>
  );
}

function UsageRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
