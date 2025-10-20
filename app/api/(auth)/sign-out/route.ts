import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";

export async function GET() {
  try {
    const cookie = await cookies();
    const session = await getIronSession<SessionData>(cookie, sessionOptions);

    // 세션이 있는지 검증
    const userId = session.user?.id;
    if (!userId) throw new Error("로그아웃 할 사용자가 없습니다.");

    session.destroy();

    // 성공
    console.log(`사용자 로그아웃 성공 ID: ${userId}`);
    return NextResponse.json({ message: "로그아웃 성공" });
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  }
}
