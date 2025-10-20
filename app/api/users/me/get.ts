import { getPool } from "@/app/api/db";
import { UserType } from "@/app/types";
import { SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import OracleDB from "oracledb";

interface ResultType extends UserType {
  FILE_COUNT: number;
  TOTAL_FILE_SIZE: number;
}

export default async function GET() {
  let conn = null;

  try {
    // 세션 검증
    const cookie = await cookies();
    const session = await getIronSession<SessionData>(cookie, sessionOptions);
    if (!session.user) throw new Error("로그인이 필요합니다.");

    // 쿼리 실행
    const pool = await getPool();
    conn = await pool.getConnection();

    const res = await conn.execute<ResultType>(
      `
      SELECT 
            u.ID 
        ,   u.USERNAME 
        ,   u.CREATED_AT 
        ,   COUNT(f.ID) AS FILE_COUNT 
        ,   NVL(SUM(f.SIZE_BYTES),0) AS TOTAL_FILE_SIZE 
      FROM LITEDRIVE_USER u 
      LEFT OUTER JOIN LITEDRIVE_FILE f ON f.OWNER_ID = u.ID 
      WHERE u.ID = :id 
      GROUP BY u.ID, u.USERNAME, u.CREATED_AT`,
      { id: session.user.id },
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );

    const user = res.rows?.[0];
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    // 성공
    console.log(`사용자 조회 성공 ID: ${session.user.id}`);
    return NextResponse.json({ message: "사용자 조회 성공", user: user }, { status: 200 });
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  } finally {
    if (conn) await conn.close();
  }
}
