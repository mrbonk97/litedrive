import { getPool } from "@/app/api/db";
import { encryptPassword } from "@/app/api/encrypt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let conn = null;
  const { username, password } = await req.json();

  try {
    // 입력 검증
    if (!username) throw new Error("아이디가 제공되지 않았습니다.");
    if (!password) throw new Error("패스워드가 제공되지 않았습니다.");
    if (typeof username != "string") throw new Error("아이디의 형식이 올바르지 않습니다.");
    if (typeof password != "string") throw new Error("아이디의 형식이 올바르지 않습니다.");

    if (username.length < 4 || username.length > 32)
      throw new Error("아이디는 4 ~ 32자 사이로 입력해주세요.");
    if (password.length < 4 || password.length > 32)
      throw new Error("비밀번호는 4 ~ 32자 사이로 입력해주세요.");

    // 패스워드 암호화
    const hashPassword = await encryptPassword(password);

    // 쿼리 실행
    const pool = await getPool();
    conn = await pool.getConnection();

    const res = await conn.execute(
      "INSERT INTO LITEDRIVE_USER (USERNAME, PASSWORD) VALUES (:username, :password)",
      { username: username, password: hashPassword },
      { autoCommit: true }
    );

    if (res.rowsAffected != 1) {
      throw new Error("오류가 발생했습니다.");
    }

    // 성공
    console.log(`회원 가입 성공 username: ${username}`);
    return NextResponse.json({ message: "회원 가입 성공" }, { status: 201 });
  } catch (err) {
    console.error((err as Error).message);

    if (err instanceof Error && err.message.startsWith("ORA-00001:"))
      return NextResponse.json({ message: "아이디를 이미 사용 중입니다." }, { status: 400 });

    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  } finally {
    if (conn) await conn.close();
  }
}
