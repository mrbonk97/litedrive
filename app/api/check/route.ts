import { ErrorCode } from "@/lib/handle-error";
import { handleError } from "@/lib/handle-error";
import { NextRequest, NextResponse } from "next/server";
import { getSharedFileById } from "@/server/services/file.service";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const code = sp.get("code");

  try {
    if (typeof code !== "string") {
      throw new Error(ErrorCode.INVALID_INPUT);
    }

    const file = await getSharedFileById(code);
    return NextResponse.json({ file });
  } catch (err) {
    return handleError(err);
  }
}
