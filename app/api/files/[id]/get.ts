import OracleDB from "oracledb";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/app/api/db";
import { FileType } from "@/app/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function GET(_: NextRequest, { params }: Props) {
  let conn = null;
  let { id }: { id: string | number } = await params;

  try {
    // 세션 검증
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    if (!session.user) throw new Error("로그인이 필요합니다.");

    // 입력값 검증
    id = parseInt(id);
    if (Number.isNaN(id)) throw new Error("파일 아이디의 형식이 올바르지 않습니다.");

    const pool = await getPool();
    conn = await pool.getConnection();

    // 권한 검증
    const authRes = await conn.execute(
      "SELECT 1 FROM LITEDRIVE_FILE WHERE ID = :id AND OWNER_ID = :ownerId",
      { id: id, ownerId: session.user.id }
    );

    if (authRes.rows?.length != 1) {
      throw new Error("파일의 접근 권한이 없습니다.");
    }

    // 쿼리 실행
    const res = await conn.execute<FileType>(
      "SELECT NAME, CONTENT FROM LITEDRIVE_FILE WHERE ID = :id AND OWNER_ID = :ownerId",
      { id: id, ownerId: session.user.id },
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );

    const file = res.rows?.[0];
    if (!file) {
      throw new Error("파일을 찾을 수 없습니다.");
    }

    // 성공
    console.log(`파일 다운로드 성공 ID: ${id}`);
    return new Response(file.CONTENT, {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(file.NAME)}"`,
      },
    });
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  } finally {
    if (conn) await conn.close();
  }
}
