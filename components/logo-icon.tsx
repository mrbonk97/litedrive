import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LogoIcon({ size = "lg", className }: Props) {
  return (
    <Link href={"/"} className={cn(className)}>
      <Image
        src={"/logo-icon.svg"}
        alt="logo"
        height={512}
        width={512}
        className={`
          ${size === "sm" ? "w-8" : ""}
          ${size === "md" ? "w-16" : ""}
          ${size === "lg" ? "w-32" : ""}
        `}
      />
    </Link>
  );
}
