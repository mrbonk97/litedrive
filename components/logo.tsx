import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function Logo({ className }: Props) {
  return (
    <Link href={"/"} className={cn(className)}>
      <Image
        src={"/logo-text.svg"}
        alt="logo"
        height={196}
        width={832}
        className={"h-8 w-fit"}
      />
    </Link>
  );
}
