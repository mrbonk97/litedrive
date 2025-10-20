import { cookies } from "next/headers";
import { getPool } from "@/app/api/db";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PATCH(req: NextRequest, { params }: Props) {
  let conn = null;
  let { id }: { id: string | number } = await params;
  const json = await req.json();
  const name = json.name;
  let folderId = json.folderId;

  try {
    // 세션 검증
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    if (!session.user) throw new Error("로그인이 필요합니다.");

    const pool = await getPool();
    conn = await pool.getConnection();

    //입력값 검증 - 파일 아이디
    id = parseInt(id);
    if (Number.isNaN(id)) throw new Error("파일 아이디의 형식이 올바르지 않습니다.");

    // 입력값 검증 - 폴더 아이디
    if (folderId == null) throw new Error("폴더 아이디가 필요합니다.");
    folderId = parseInt(folderId);
    if (Number.isNaN(folderId)) throw new Error("폴더 아이디의 형식이 올바르지 않습니다.");

    // 입력값 검증 - 파일 이름
    if (name == null) throw new Error("파일 이름이 필요합니다.");
    if (typeof name !== "string") throw new Error("파일 이름의 형식이 올바르지 않습니다.");
    if (name.length < 2 || name.length > 50)
      throw new Error("파일 이름은 2 ~ 50자 사이로 입력해주세요.");

    // 권한 검증
    const authRes1 = await conn.execute(
      "SELECT 1 FROM LITEDRIVE_FILE WHERE ID = :id AND OWNER_ID = :ownerId",
      { id: id, ownerId: session.user.id }
    );

    if (authRes1.rows?.length != 1) {
      throw new Error("파일의 접근 권한이 없습니다.");
    }

    // 폴더 권한 검증 (루트로 이동이 아닐 경우)
    if (folderId !== 0) {
      const authRes2 = await conn.execute(
        "SELECT 1 FROM LITEDRIVE_FOLDER WHERE id = :folderId AND OWNER_ID = :ownerId",
        { folderId: folderId, ownerId: session.user.id }
      );

      if (authRes2.rows?.length != 1) {
        throw new Error("폴더의 접근 권한이 없습니다");
      }
    }

    // 쿼리 실행
    const result = await conn.execute(
      `
      UPDATE LITEDRIVE_FILE 
      SET 
            FOLDER_ID = DECODE(:folderId, 0, NULL, :folderId) 
        ,   NAME = :name 
      WHERE ID = :id AND OWNER_ID = :ownerId`,
      { folderId: folderId, name: name, id: id, ownerId: session.user.id },
      { autoCommit: true }
    );

    if (result.rowsAffected !== 1) {
      throw new Error("파일 수정 중 오류가 발생했습니다.");
    }

    // 성공
    console.log(`파일 수정 성공 (ID: ${id})`);
    return NextResponse.json({ message: "파일 수정 성공" }, { status: 200 });
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  } finally {
    if (conn) await conn.close();
  }
}
