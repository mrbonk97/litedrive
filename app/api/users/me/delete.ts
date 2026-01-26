import { handleError } from "@/lib/handle-error";
import { destroySession, getSession } from "@/lib/session";
import { deleteUserSchema } from "@/server/schemas/user.schema";
import { deleteUser } from "@/server/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export default async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    // 1. 입력값 검증
    const _body = deleteUserSchema.parse(body);

    await deleteUser(session.user!.id, _body);
    await destroySession();

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
