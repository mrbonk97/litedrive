import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/app/api/db";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PATCH(req: NextRequest, { params }: Props) {
  let conn = null;
  let { id }: { id: string | number } = await params;
  const json = await req.json();
  const name = json.name;
  let parentFolderId = json.parentFolderId;

  try {
    // 세션 검증
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    if (!session.user) throw new Error("로그인이 필요합니다.");

    // 입력값 검증 - 폴더 아이디
    id = parseInt(id);
    if (Number.isNaN(id)) throw new Error("폴더 아이디의 형식이 올바르지 않습니다.");

    // 입력값 검증 - 부모 폴더 아이디
    if (parentFolderId == null) throw new Error("부모 폴더 아이디가 필요합니다.");
    parentFolderId = parseInt(parentFolderId);
    if (Number.isNaN(parentFolderId)) throw new Error("폴더 아이디의 형식이 올바르지 않습니다.");

    // 입력값 검증 - 폴더 이름
    if (name == null) throw new Error("폴더 이름이 필요합니다.");
    if (typeof name !== "string") throw new Error("폴더 이름 형식이 올바르지 않습니다.");
    if (name.length < 2 || name.length > 50)
      throw new Error("폴더 이름을 2 ~ 50자 사이로 입력해주세요.");

    if (parentFolderId === id) {
      throw new Error("폴더를 자기 자신 안으로 이동할 수 없습니다.");
    }

    const pool = await getPool();
    conn = await pool.getConnection();

    // 폴더의 권한 검증
    const authRes1 = await conn.execute(
      "SELECT 1 FROM LITEDRIVE_FOLDER WHERE id = :folderId AND OWNER_ID = :ownerId",
      { folderId: id, ownerId: session.user.id }
    );

    if (authRes1.rows?.length != 1) {
      throw new Error("폴더의 접근 권한이 없습니다");
    }

    // 부모 폴더 권한 검증 (루트가 아닐 경우)
    if (parentFolderId !== 0) {
      const authRes2 = await conn.execute(
        "SELECT 1 FROM LITEDRIVE_FOLDER WHERE id = :parentFolderId AND OWNER_ID = :ownerId",
        { parentFolderId, ownerId: session.user.id }
      );
      if (authRes2.rows?.length !== 1) {
        throw new Error("부모 폴더의 접근 권한이 없습니다");
      }
    }

    // 쿼리 실행
    const res = await conn.execute(
      `
      UPDATE LITEDRIVE_FOLDER 
      SET 
            PARENT_FOLDER_ID = DECODE(:parentFolderId, 0, NULL, :parentFolderId) 
        ,   NAME = :name 
      WHERE ID = :id AND OWNER_ID = :ownerId`,
      { parentFolderId: parentFolderId, name: name, id: id, ownerId: session.user.id },
      { autoCommit: true }
    );

    if (res.rowsAffected !== 1) {
      throw new Error("폴더 수정 중 오류가 발생했습니다.");
    }

    console.log(`폴더 수정 성공 ID: ${id}`);
    return NextResponse.json({ message: "폴더 수정 성공" }, { status: 200 });
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  } finally {
    if (conn) await conn.close();
  }
}
