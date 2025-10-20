import { FileType } from "@/app/types";
import { cookies } from "next/headers";

export async function getFolderById(id: number, q?: string, filter?: string) {
  const cookieStore = await cookies();

  const url = new URL(`${process.env.API_URL}/folders/${id}`);
  if (q) url.searchParams.append("q", q);
  if (filter) url.searchParams.append("filter", filter);

  const res = await fetch(url, {
    headers: { Cookie: cookieStore.toString() },
  });

  const { message, files, breadCrumbs } = await res.json();

  if (!res.ok) {
    throw new Error(message || "폴더를 가져오는 중 오류가 발생했습니다.");
  }

  return { files, breadCrumbs } as { files: FileType[]; breadCrumbs: FileType[] };
}
