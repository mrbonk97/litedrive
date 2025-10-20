import Link from "next/link";
import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Audiowide } from "next/font/google";

interface Props {
  className?: string;
}

const audioWide = Audiowide({
  subsets: ["latin"],
  weight: ["400"],
});

export function Logo({ className }: Props) {
  return (
    <Link href={"/"} className={cn("h-6 flex items-center gap-2  text-rose-400", className)}>
      <Sparkle />
      <span className={`text-3xl ${audioWide.className}`}>LiteDrive</span>
    </Link>
  );
}
