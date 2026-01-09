import { handleError } from "@/lib/error";
import { getSession } from "@/lib/session";
import { deleteUserSchema } from "@/schemas/auth-schema";
import { deleteUser } from "@/services/user-service";
import { NextRequest, NextResponse } from "next/server";

export default async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    // 1. 입력값 검증
    const { password } = deleteUserSchema.parse(body);

    await deleteUser(session.user!.id, password);

    return NextResponse.json({ message: "회원탈퇴 성공" }, { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}
