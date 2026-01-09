import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createSession,
  destroySession,
  getSession,
  isLoggedIn,
} from "./session";

// ---- mocks ----
const mockSession: any = {
  user: undefined,
  save: vi.fn(),
  destroy: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: vi.fn(async () => ({})),
}));

vi.mock("iron-session", () => ({
  getIronSession: vi.fn(async () => mockSession),
}));

// ---- tests ----
describe("session test", () => {
  beforeEach(() => {
    mockSession.user = undefined;
    mockSession.save.mockClear();
    mockSession.destroy.mockClear();
  });

  it("createSession sets user and saves session", async () => {
    await createSession("1", "scott");

    expect(mockSession.user).toEqual({
      id: "1",
      username: "scott",
    });
    expect(mockSession.save).toHaveBeenCalledOnce();
  });

  it("isLoggedIn returns true when session exists", async () => {
    mockSession.user = { id: "1", username: "hana" };

    const result = await isLoggedIn();
    expect(result).toBe(true);
  });

  it("isLoggedIn returns false when no session", async () => {
    const result = await isLoggedIn();
    expect(result).toBe(false);
  });

  it("getSession throws if no session", async () => {
    await expect(getSession()).rejects.toThrow();
  });

  it("destroySession throws if no user", async () => {
    await expect(destroySession()).rejects.toThrow();
  });

  it("destroySession destroys session when user exists", async () => {
    mockSession.user = { id: "1", username: "hana" };

    await destroySession();
    expect(mockSession.destroy).toHaveBeenCalledOnce();
  });
});
