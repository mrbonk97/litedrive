import { handleError } from "@/lib/handle-error";
import { getSession } from "@/lib/session";
import { updateUserSchema } from "@/schemas/auth-schema";
import { updateUserInfo } from "@/services/user-service";
import { NextRequest, NextResponse } from "next/server";

export default async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    // 1. 입력값 검증
    const { oldPassword, newPassword } = updateUserSchema.parse(body);

    await updateUserInfo(session.user!.id, oldPassword, newPassword);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
