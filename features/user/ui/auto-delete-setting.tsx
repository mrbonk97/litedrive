"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Clock3 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { updateAutoDeleteEnabled } from "@/features/user/api/auto-delete.api";

interface Props {
  initialEnabled: boolean;
}

export function AutoDeleteSetting({ initialEnabled }: Props) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(initialEnabled);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const nextEnabled = !enabled;

    startTransition(async () => {
      const result = await updateAutoDeleteEnabled(nextEnabled);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setEnabled(nextEnabled);
      toast.success(
        nextEnabled
          ? "파일 자동 삭제를 켰습니다. 파일은 7일 후 삭제됩니다."
          : "파일 자동 삭제를 껐습니다.",
      );
      router.refresh();
    });
  }

  return (
    <section className="col-span-4 p-4 rounded-lg border bg-card flex items-center gap-4">
      <Clock3 className="shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <h2 className="font-semibold">7일 후 자동 삭제</h2>
        <p className="text-sm text-muted-foreground">
          켜면 현재 파일과 새로 올린 파일을 7일 후 자동으로 삭제합니다.
        </p>
      </div>
      <Button
        type="button"
        variant={enabled ? "default" : "outline"}
        disabled={isPending}
        aria-pressed={enabled}
        onClick={handleToggle}
      >
        {isPending ? <Spinner /> : enabled ? "ON" : "OFF"}
      </Button>
    </section>
  );
}
