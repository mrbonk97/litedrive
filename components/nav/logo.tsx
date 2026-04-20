import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sparkle } from "lucide-react";
import { audioWide } from "@/lib/fonts";

interface Props {
  className?: string;
}

export function Logo({ className }: Props) {
  return (
    <Link
      href={"/"}
      className={cn("h-6 flex items-center gap-2  text-rose-400", className)}
    >
      <Sparkle />
      <span className={`text-lg md:text-2xl ${audioWide.className}`}>
        LiteDrive
      </span>
    </Link>
  );
}
