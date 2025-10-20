import { getPool } from "@/app/api/db";
import { SessionData, sessionOptions } from "@/lib/session";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import OracleDB from "oracledb";

interface Props {
  params: Promise<{ id: string }>;
}

const MAX_SIZE = 2_000_000_000;

export async function POST(req: NextRequest, { params }: Props) {
  let conn = null;
  const { id } = await params;

  try {
    // 사용자 검증
    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
    if (!session.user) throw new Error("사용 권한이 없습니다.");

    // 입력값 검증
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) throw new Error("업로드 할 파일을 선택해주세요");
    if (!(file instanceof File)) throw new Error("파일 형식이 올바르지 않습니다.");
    if (file.size > MAX_SIZE) throw new Error("파일의 용량이 20MB를 초과했습니다.");

    const pool = await getPool();
    conn = await pool.getConnection();

    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await conn.execute(
      `
      INSERT INTO LITEDRIVE_FILE ( 
            OWNER_ID 
        ,   FOLDER_ID 
        ,   NAME 
        ,   MIME_TYPE 
        ,   SIZE_BYTES 
        ,   CONTENT 
        ) VALUES ( 
            :ownerId 
        ,   DECODE(:folderId, 0, NULL, :folderId) 
        ,   :name 
        ,   :mimeType 
        ,   :sizeBytes 
        ,   :content)`,
      {
        ownerId: session.user.id,
        folderId: id,
        name: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        content: buffer,
      },
      { outFormat: OracleDB.OUT_FORMAT_OBJECT, autoCommit: true }
    );

    if (result.rowsAffected != 1) throw new Error("파일 업로드 중 오류가 발생했습니다.");

    return NextResponse.json({ message: "파일 업로드 성공" }, { status: 201 });
  } catch (err) {
    console.error((err as Error).message);
    return NextResponse.json({ message: (err as Error).message }, { status: 400 });
  } finally {
    if (conn) await conn.close();
  }
}
