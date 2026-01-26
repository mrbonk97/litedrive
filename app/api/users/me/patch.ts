import { handleError } from "@/lib/handle-error";
import { getSession } from "@/lib/session";
import { updateUserSchema } from "@/server/schemas/user.schema";
import { updateUser } from "@/server/services/user.service";
import { NextRequest, NextResponse } from "next/server";

export default async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    // 1. 입력값 검증
    const _body = updateUserSchema.parse(body);

    const user = await updateUser(session.user!.id, _body);

    return NextResponse.json(user);
  } catch (err) {
    return handleError(err);
  }
}
