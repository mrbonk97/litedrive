import { sql } from "drizzle-orm";

export function toDrizzleSet<T extends Record<string, unknown>>(data: T) {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([, v]) => v !== undefined) // 수정 안 함 제거
      .map(([k, v]) => [
        k,
        v === null ? sql`null` : v, // null → sql`null`
      ])
  );
}
