import "server-only";

const attempts = new Map<string, number[]>();

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter((time) => now - time < windowMs);
  if (recent.length >= limit) return false;
  recent.push(now);
  attempts.set(key, recent);
  return true;
}
