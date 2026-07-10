const FALLBACK_SITE_URL = "http://localhost:3000";

export const SITE_NAME = "LiteDrive";
export const SITE_DESCRIPTION =
  "개인정보 부담 없이 파일을 보관하고 공유하는 가벼운 클라우드 드라이브.";

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();

  if (!configuredUrl) {
    return new URL(FALLBACK_SITE_URL);
  }

  try {
    const hasProtocol = /^https?:\/\//i.test(configuredUrl);
    const isLocal = /^(localhost|127\.0\.0\.1)(:\d+)?(\/|$)/i.test(
      configuredUrl,
    );
    const normalizedUrl = hasProtocol
      ? configuredUrl
      : `${isLocal ? "http" : "https"}://${configuredUrl}`;
    const siteUrl = new URL(normalizedUrl);

    if (!['http:', 'https:'].includes(siteUrl.protocol)) {
      return new URL(FALLBACK_SITE_URL);
    }

    return siteUrl;
  } catch {
    return new URL(FALLBACK_SITE_URL);
  }
}
