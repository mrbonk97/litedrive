import { SignJWT } from "jose";

const SECRET = process.env.JWT_SECRET!;

export async function generateJwt(sub: string, fileId: string) {
  const key = new TextEncoder().encode(SECRET);

  return await new SignJWT({ fileId })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime("1min")
    .sign(key);
}
