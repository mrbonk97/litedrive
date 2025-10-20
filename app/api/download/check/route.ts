import OracleDB from "oracledb";
import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/app/api/db";
import { FileType } from "@/app/types";

export async function GET(req: NextRequest) {
  let conn = null;
  const code = req.nextUrl.searchParams.get("code");

  try {
    // 입력값 검증
    if (code == null) {
      throw new Error("공유 코드를 입력해주세요");
    }
    if (typeof code !== "string") {
      throw new Error("공유 코드의 형식이 올바르지 않습니다.");
    }

    const pool = await getPool();
    conn = await pool.getConnection();

    // 쿼리 실행
    const res = await conn.execute<FileType>(
      "SELECT ID, NAME, SIZE_BYTES FROM LITEDRIVE_FILE WHERE SHARE_CODE = :code",
      { code: code },
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );

    const file = res.rows?.[0];
    if (!file) {
      throw new Error("파일을 찾을 수 없습니다.");
    }

    // 성공
    console.log(`공유 파일 조회 성공 ID: ${file.ID}`);
    return NextResponse.json({ message: "공유 파일 조회 성공", file: file });
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  } finally {
    if (conn) await conn.close();
  }
}
