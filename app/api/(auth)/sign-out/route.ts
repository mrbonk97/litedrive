import { NextResponse } from "next/server";
import { destroySession } from "@/lib/session";
import { handleError } from "@/lib/handle-error";

export async function GET() {
  try {
    await destroySession();

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
