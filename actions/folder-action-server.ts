import { cookies } from "next/headers";
import { BreadCrumbType, FileType, FolderType } from "@/types";

export async function getFolderById(
  id: string | null,
  q: string | undefined,
  filter: string | undefined
) {
  const cookieStore = await cookies();

  const url = id
    ? new URL(`${process.env.API_URL}/folders/${id}`) // normal folder
    : new URL(`${process.env.API_URL}/folders`); // root folder

  if (q) url.searchParams.append("q", q);
  if (filter) url.searchParams.append("filter", filter);

  const res = await fetch(url, {
    headers: { Cookie: cookieStore.toString() },
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "폴더 조회 중 오류가 발생했습니다.");
  }

  const { folders, files, breadCrumb } = await res.json();
  return { folders, files, breadCrumb } as {
    folders: FolderType[];
    files: FileType[];
    breadCrumb: BreadCrumbType[];
  };
}
