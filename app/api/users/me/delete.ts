import { getPool } from "@/app/api/db";
import { UserType } from "@/app/types";
import { SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import OracleDB from "oracledb";
import { compareHash } from "../../encrypt";

export default async function DELETE(req: NextRequest) {
  let conn = null;
  const { password } = await req.json();

  try {
    // 세션 검증
    const cookie = await cookies();
    const session = await getIronSession<SessionData>(cookie, sessionOptions);
    if (!session.user) throw new Error("로그인이 필요합니다.");

    // 입력값 검증
    if (!password) throw new Error("패스워드가 제공되지 않았습니다.");
    if (typeof password != "string") throw new Error("패스워드 형식이 올바르지 않습니다.");

    // 쿼리 실행 1 - 사용자 정보 조회
    const pool = await getPool();
    conn = await pool.getConnection();

    const res1 = await conn.execute<UserType>(
      "SELECT * FROM LITEDRIVE_USER WHERE ID = :id",
      { id: session.user.id },
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );

    const user = res1.rows?.[0];
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    console.log(password, user, user.PASSWORD);
    const isMatch = await compareHash(password, user.PASSWORD);
    if (!isMatch) {
      throw new Error("패스워드가 일치하지 않습니다.");
    }

    // 쿼리 실행 2 - 사용자 삭제
    const res2 = await conn.execute(
      "DELETE FROM LITEDRIVE_USER WHERE ID = :id",
      { id: session.user.id },
      { autoCommit: true }
    );

    if (res2.rowsAffected != 1) {
      throw new Error("회원 탈퇴 중 오류가 발생했습니다.");
    }

    const id = session.user.id;
    session.destroy();

    // 성공
    console.log(`회원 탈퇴 성공 ID: ${id}`);
    return NextResponse.json({ message: "회원 탈퇴 성공" }, { status: 200 });
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  } finally {
    if (conn) await conn.close();
  }
}
