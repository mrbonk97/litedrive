import { NextResponse } from "next/server";
import { destroySession } from "@/lib/session";
import { handleError } from "@/lib/error";

export async function GET() {
  try {
    await destroySession();

    return NextResponse.json({ message: "로그아웃 성공" });
  } catch (err) {
    return handleError(err);
  }
}
