import { usePathname } from "next/navigation";

export function useFolder() {
  const pathname = usePathname();
  const folderId = pathname.split("/")[2] ?? null;

  return { folderId };
}
