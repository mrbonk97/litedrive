import { handleError } from "@/lib/handle-error";
import { getSession } from "@/lib/session";
import { getUserInfo } from "@/services/user-service";
import { NextResponse } from "next/server";

export default async function GET() {
  try {
    const session = await getSession();

    const user = await getUserInfo(session.user!.id);

    return NextResponse.json({ user });
  } catch (err) {
    return handleError(err);
  }
}
