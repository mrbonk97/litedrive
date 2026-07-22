import { HardDrive } from "lucide-react";

import { Logo } from "../logo";
import { CreateFolderDialog } from "@/features/folders/ui/create-folder-dialog";
import { UploadFileDialog } from "@/features/files/ui/upload-file-dialog";
import { createClient } from "@/lib/supabase/server";
import { formatFileSize } from "@/lib/utils";

const STORAGE_LIMIT_BYTES = 500 * 1024 * 1024;

export async function Leftnav() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let usedBytes = 0;

  if (user) {
    const { data } = await supabase.from("files").select("size");

    usedBytes =
      data?.reduce((total, file) => total + Number(file.size ?? 0), 0) ?? 0;
  }

  const usagePercent = Math.min((usedBytes / STORAGE_LIMIT_BYTES) * 100, 100);

  return (
    <aside className="fixed hidden lg:flex top-0 bottom-0 left-0 w-64 flex-col bg-sidebar border-r">
      <section className="p-2 h-14 border-b">
        <Logo className="p-0.5 object-contain block h-full rounded-lg hover:bg-sidebar-accent" />
      </section>

      <section className="py-4 px-2 space-y-2 border-b">
        <UploadFileDialog />
        <CreateFolderDialog />
      </section>

      <section className="mt-auto border-t p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <HardDrive size={16} className="text-rose-500" />
            <p className="text-sm font-medium">저장 공간</p>
          </div>
          <p className="text-xs text-muted-foreground">
            {usagePercent.toFixed(0)}%
          </p>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-rose-500 transition-all"
            style={{ width: `${usagePercent}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {formatFileSize(usedBytes)} / 500 MB 사용 중
        </p>
      </section>
    </aside>
  );
}
