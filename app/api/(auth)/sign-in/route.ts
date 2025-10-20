import { getPool } from "@/app/api/db";
import { UserType } from "@/app/types";
import { compareHash } from "@/app/api/encrypt";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";
import OracleDB from "oracledb";

export async function POST(req: NextRequest) {
  let conn = null;
  const { username, password } = await req.json();

  try {
    // 입력 검증
    if (!username) throw new Error("아이디가 제공되지 않았습니다.");
    if (!password) throw new Error("패스워드가 제공되지 않았습니다.");
    if (typeof username != "string") throw new Error("아이디의 형식이 올바르지 않습니다.");
    if (typeof password != "string") throw new Error("패스워드의 형식이 올바르지 않습니다.");

    // 쿼리 실행
    const pool = await getPool();
    conn = await pool.getConnection();

    const result = await conn.execute<UserType>(
      "SELECT * FROM LITEDRIVE_USER WHERE USERNAME = :username",
      { username: username },
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );

    if (result.rows?.length != 1) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    const user = result.rows[0];

    // 비밀번호 검증
    const isPasswordMatch = await compareHash(password, user.PASSWORD);
    if (!isPasswordMatch) {
      throw new Error("패스워드가 일치하지 않습니다.");
    }

    // 세션 생성
    const cookie = await cookies();
    const session = await getIronSession<SessionData>(cookie, sessionOptions);
    session.user = { id: user.ID, username: user.USERNAME };
    await session.save();

    // 성공
    console.log(`사용자 로그인 성공 ID:${user.ID}`);
    return NextResponse.json({ message: "로그인 성공" });
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  } finally {
    if (conn) await conn.close();
  }
}
