import bcrypt from "bcrypt";

const saltRounds = 10;

export async function encryptPassword(plainPassword: string) {
  const hashPassword = await bcrypt.hash(plainPassword, saltRounds);
  return hashPassword;
}

export async function compareHash(plainPassword: string, hashPassword: string) {
  return await bcrypt.compare(plainPassword, hashPassword);
}
