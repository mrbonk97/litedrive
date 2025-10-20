import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/app/api/db";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DELETE(_: NextRequest, { params }: Props) {
  let conn = null;
  let { id }: { id: string | number } = await params;

  try {
    // 사용자 검증
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    if (!session.user) throw new Error("로그인이 필요합니다.");

    // 입력값 검증
    id = parseInt(id);
    if (Number.isNaN(id)) throw new Error("폴더 아이디의 형식이 올바르지 않습니다.");

    const pool = await getPool();
    conn = await pool.getConnection();

    // 폴더의 권한 검증
    const authRes = await conn.execute(
      "SELECT 1 FROM LITEDRIVE_FOLDER WHERE ID = :id AND OWNER_ID = :ownerId",
      { id: id, ownerId: session.user.id }
    );

    if (authRes.rows?.length != 1) {
      throw new Error("폴더의 접근 권한이 없습니다");
    }

    // 쿼리 실행
    const res = await conn.execute(
      "DELETE FROM LITEDRIVE_FOLDER WHERE ID = :id AND OWNER_ID = :ownerId",
      { id: id, ownerId: session.user.id },
      { autoCommit: true }
    );

    if (res.rowsAffected != 1) {
      throw new Error("폴더 삭제 중 오류가 발생했습니다.");
    }

    // 성공
    console.log(`폴더 삭제 성공 ID:${id}`);
    return NextResponse.json({ message: "폴더 삭제 성공" }, { status: 200 });
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  } finally {
    if (conn) await conn.close();
  }
}
