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

export default async function GET(req: NextRequest, { params }: Props) {
  let conn = null;
  let { id }: { id: string | number } = await params;
  const sp = req.nextUrl.searchParams;
  const q = sp.get("q");
  const filter = sp.get("filter");

  try {
    // 사용자 검증
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    if (!session.user) throw new Error("로그인이 필요합니다.");

    // 입력값 검증
    id = parseInt(id);
    if (Number.isNaN(id)) throw new Error("폴더 아이디의 형식이 올바르지 않습니다.");

    if (q) {
      if (typeof q !== "string") throw new Error("검색어의 형식이 올바르지 않습니다.");
    }

    if (filter) {
      if (filter !== "share") throw new Error("필터가 올바르지 않습니다.");
    }

    const pool = await getPool();
    conn = await pool.getConnection();

    // 폴더의 권한 검증
    // 최상이 폴더인 0은 제외
    if (id !== 0) {
      const authRes = await conn.execute(
        "SELECT 1 FROM LITEDRIVE_FOLDER WHERE id = :folderId AND OWNER_ID = :ownerId",
        { folderId: id, ownerId: session.user.id }
      );

      if (authRes.rows?.length != 1) {
        throw new Error("폴더의 접근 권한이 없습니다");
      }
    }

    // 쿼리 실행 1 - 폴더 내부의 파일 & 폴더 조회
    // filter category가 있을 경우, 모든 파일의 공유상태만으로 필터링 검색어 X, 현재폴더 X
    const res1 = await conn.execute<FileType>(
      `
      SELECT 
            f.ID 
        ,   NULL as FOLDER_ID 
        ,   NVL(PARENT_FOLDER_ID, 0) as PARENT_FOLDER_ID
        ,   u.USERNAME 
        ,   f.NAME 
        ,   f.UPDATED_AT 
        ,   0 AS SIZE_BYTES 
        ,   'FOLDER' AS FILE_TYPE 
        ,   NULL as SHARE_CODE 
      FROM LITEDRIVE_FOLDER f 
      JOIN LITEDRIVE_USER u ON f.OWNER_ID = u.ID 
      WHERE 1 = 1
      ${filter ? "" : q ? "" : "AND NVL(f.PARENT_FOLDER_ID, 0) = NVL(:folderId, 0) "}
      ${filter ? "" : "AND f.NAME LIKE '%' || :q || '%' "}
      ${filter ? "AND 0 = 1" : ""} 
      AND f.OWNER_ID = :ownerId 
      

      UNION ALL

      SELECT 
            fi.ID 
        ,   fi.FOLDER_ID 
        ,   NULL as PARENT_FOLDER_ID
        ,   u.USERNAME 
        ,   fi.NAME 
        ,   fi.UPDATED_AT 
        ,   fi.SIZE_BYTES 
        ,   'FILE' AS FILE_TYPE 
        ,   fi.SHARE_CODE 
      FROM LITEDRIVE_FILE fi  
      JOIN LITEDRIVE_USER u ON fi.OWNER_ID = u.ID 
      WHERE 1 = 1
      ${filter ? "" : q ? "" : "AND NVL(fi.FOLDER_ID, 0) = NVL(:folderId, 0) "}
      ${filter ? "" : "AND fi.NAME LIKE '%' || :q || '%'"}
      ${filter ? "AND fi.SHARE_CODE IS NOT NULL" : ""}
      AND fi.OWNER_ID = :ownerId 
    `,
      filter
        ? { ownerId: session.user.id }
        : q
        ? { ownerId: session.user.id, q: q ? q : "" }
        : { folderId: id, ownerId: session.user.id, q: q ? q : "" },
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );

    // 쿼리 실행 2 - 폴더의 breadCrumbs 조회
    const res2 = await conn.execute(
      `
      SELECT 
            ID 
        ,   NAME 
        ,   PARENT_FOLDER_ID 
        ,   LEVEL AS DEPTH 
      FROM LITEDRIVE_FOLDER 
      WHERE OWNER_ID = :ownerId 
      START WITH id = :folderId 
      CONNECT BY PRIOR PARENT_FOLDER_ID = ID 
      ORDER BY DEPTH DESC`,
      { ownerId: session.user.id, folderId: id },
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );

    // 성공
    console.log(`폴더 조회 성공 ID: ${id}, q: ${q}, filter: ${filter}`);
    return NextResponse.json({ message: `폴더 조회 성공`, files: res1.rows, breadCrumbs: res2.rows }, { status: 200 });
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  } finally {
    if (conn) await conn.close();
  }
}
