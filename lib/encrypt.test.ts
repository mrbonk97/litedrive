import { describe, it, expect } from "vitest";
import { compareHash, encryptPassword } from "./encrypt";

describe("encrypt test", () => {
  const plain = "correctPassword";

  it("should hash password", async () => {
    const hash = await encryptPassword(plain);
    expect(hash).toBeDefined();
    expect(hash).not.toBe(plain);
  });

  it("should return true for correct password", async () => {
    const hash = await encryptPassword(plain);
    const result = await compareHash(plain, hash);
    expect(result).toBe(true);
  });

  it("should return false for incorrect password", async () => {
    const hash = await encryptPassword(plain);
    const result = await compareHash("wrongPassword", hash);
    expect(result).toBe(false);
  });
});
