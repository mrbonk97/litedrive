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

  const { message, folders, files, breadCrumb } = await res.json();

  if (!res.ok) {
    throw new Error(message || "폴더를 가져오는 중 오류가 발생했습니다.");
  }

  return { folders, files, breadCrumb } as {
    folders: FolderType[];
    files: FileType[];
    breadCrumb: BreadCrumbType[];
  };
}
