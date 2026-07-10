import type { User } from "@supabase/supabase-js";
import { CalendarDays, User as UserIcon } from "lucide-react";
import { LogoIcon } from "@/components/logo-icon";
import type { ProfileSummary } from "@/features/profile/model/profile-summary";
import { formatDate, formatFileSize, getUsername } from "@/lib/utils";

interface Props {
  user: User;
  summary: ProfileSummary;
}

export function ProfileHeader({ user, summary }: Props) {
  return (
    <header className="col-span-4 p-4 grid gap-4 rounded-lg bg-primary text-primary-foreground">
      <LogoIcon size="sm" />
      <h1 className="text-2xl lg:text-4xl font-semibold">
        {getUsername(user.email)}님의 드라이브
      </h1>
      <div className="mt-8 flex flex-wrap gap-4 text-sm text-primary-foreground/80">
        <span className="inline-flex items-center gap-2">
          <UserIcon size={16} />
          {user.email}
        </span>
        <span className="inline-flex items-center gap-2">
          <CalendarDays size={16} />
          가입일 {formatDate(user.created_at)}
        </span>
      </div>
      <div className="p-4 rounded-lg bg-background/10">
        <p className="text-sm text-primary-foreground/70">스토리지 상태</p>
        <p className="mt-2 text-2xl font-semibold">{summary.usageLabel}</p>
        <p className="text-sm text-primary-foreground/70">
          {formatFileSize(summary.remainingBytes)} 남음
        </p>
      </div>
    </header>
  );
}
