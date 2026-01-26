import { cookies } from "next/headers";
import { GetFolderPayload } from "./folder.type";

export async function getFolderById(payLoad: GetFolderPayload) {
  const cookie = await cookies();
  const session = cookie.get("litedrive_session")?.value;

  const url = new URL(
    `${process.env.API_URL}${payLoad.id ? `/folders/${payLoad.id}` : "/folders"}`,
  );

  if (payLoad.q) url.searchParams.set("q", payLoad.q);
  if (payLoad.filter) url.searchParams.set("filter", payLoad.filter);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Cookie: `litedrive_session=${session}`,
    },
  });

  if (!res.ok) {
    const { message } = await res.json();
    throw new Error(message || "폴더 조회 중 오류가 발생했습니다.");
  }

  return await res.json();
}
