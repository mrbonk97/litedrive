import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/app/api/db";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function POST(req: NextRequest, { params }: Props) {
  let conn = null;
  let { id }: { id: string | number } = await params;
  const { name } = await req.json();

  try {
    // 세션 검증
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    if (!session.user) throw new Error("로그인이 필요합니다.");

    // 입력값 검증
    id = parseInt(id);
    if (Number.isNaN(id)) throw new Error("폴더 아이디의 형식이 올바르지 않습니다.");

    if (name == null) throw new Error("폴더명 이름이 필요합니다.");
    if (typeof name != "string") throw new Error("폴더 이름의 형식이 올바르지 않습니다.");
    if (name.length < 2 || name.length > 50)
      throw new Error("폴더 이름을 2 ~ 50자 사이로 입력해주세요.");

    const pool = await getPool();
    conn = await pool.getConnection();

    // 폴더 권한 검증 (루트가 아닐 경우)
    if (id !== 0) {
      const authRes = await conn.execute(
        "SELECT 1 FROM LITEDRIVE_FOLDER WHERE id = :folderId AND owner_id = :ownerId",
        { folderId: id, ownerId: session.user.id }
      );

      if (authRes.rows?.length != 1) {
        throw new Error("폴더의 접근 권한이 없습니다");
      }
    }

    // 쿼리 실행
    const result = await conn.execute(
      `
      INSERT INTO LITEDRIVE_FOLDER(
            OWNER_ID
        ,   NAME
        ,   PARENT_FOLDER_ID
      ) VALUES (
            :ownerId
        ,   :name
        ,   DECODE(:parentFolderId, 0, NULL, :parentFolderId)
      )`,
      { ownerId: session.user.id, name: name, parentFolderId: id },
      { autoCommit: true }
    );

    if (result.rowsAffected !== 1) {
      throw new Error("폴더 생성 중 오류가 발생했습니다.");
    }

    // 성공
    console.log(`폴더 생성 성공: ${id}`);
    return NextResponse.json({ message: `폴더 생성 성공` }, { status: 201 });
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({ success: false, message: (err as Error).message }, { status: 400 });
  } finally {
    if (conn) await conn.close();
  }
}
