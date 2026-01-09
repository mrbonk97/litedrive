import { describe, it, expect } from "vitest";
import { formatSize, getFileIcon } from "./utils";

describe("formatSize test", () => {
  it("formats bytes", () => {
    expect(formatSize(500)).toBe("500B");
  });

  it("formats KB", () => {
    expect(formatSize(10_000)).toBe("1.00KB");
  });

  it("formats MB", () => {
    expect(formatSize(1_000_000)).toBe("1.00MB");
  });

  it("formats GB", () => {
    expect(formatSize(1_000_000_000)).toBe("1.00GB");
  });
});

describe("getFileIcon test", () => {
  it("returns default icon for unknown type", () => {
    expect(getFileIcon("unknown")).toBe("/static/icons/024-text.svg");
  });

  it("returns default icon for null", () => {
    expect(getFileIcon(null)).toBe("/static/icons/024-text.svg");
  });
});
