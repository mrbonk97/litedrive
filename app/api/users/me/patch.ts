import { getPool } from "@/app/api/db";
import { SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { compareHash, encryptPassword } from "../../encrypt";
import { UserType } from "@/app/types";
import OracleDB from "oracledb";

export default async function PATCH(req: NextRequest) {
  let conn = null;
  const { oldPassword, newPassword } = await req.json();

  try {
    // 세션 검증
    const cookie = await cookies();
    const session = await getIronSession<SessionData>(cookie, sessionOptions);
    if (!session.user) throw new Error("로그인이 필요합니다.");

    // 입력값 검증
    if (!oldPassword || !newPassword) throw new Error("패스워드를 입력해주세요.");
    if (typeof oldPassword !== "string" || typeof newPassword !== "string")
      throw new Error("패스워드 형식이 올바르지 않습니다.");
    if (oldPassword.length < 4 || oldPassword.length > 32)
      throw new Error("비밀번호는 4 ~ 32자 사이로 입력해주세요.");
    if (newPassword.length < 4 || newPassword.length > 32)
      throw new Error("비밀번호는 4 ~ 32자 사이로 입력해주세요.");

    // 쿼리 실행 1 - 사용자 정보 조회
    const pool = await getPool();
    conn = await pool.getConnection();

    const res = await conn.execute<UserType>(
      "SELECT * FROM LITEDRIVE_USER WHERE ID = :id",
      { id: session.user.id },
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );

    const user = res.rows?.[0];
    if (!user) {
      throw new Error("사용자를 찾을 수 없습니다.");
    }

    const isMatch = await compareHash(oldPassword, user.PASSWORD);
    if (!isMatch) {
      throw new Error("기존 패스워드가 일치하지 않습니다.");
    }

    // 쿼리 실행 2 - 패스워드 업데이트
    const hashPassword = await encryptPassword(newPassword);
    await conn.execute(
      "UPDATE LITEDRIVE_USER SET PASSWORD = :password WHERE ID = :id",
      { password: hashPassword, id: session.user.id },
      { autoCommit: true }
    );

    // 성공
    const id = session.user.id;
    session.destroy();
    console.log(`비밀번호 변경 성공 ID: ${id}`);
    return NextResponse.json({ message: "비밀번호가 변경되었습니다." });
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  } finally {
    if (conn) await conn.close();
  }
}
