/** Canonical production origin (metadata, sitemap, JSON-LD). Override with NEXT_PUBLIC_SITE_URL if needed. */
const SITE_URL_PRODUCTION = "https://stackfeed.vercel.app";

/** Canonical site origin for metadata, sitemap, and structured data. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:3000";
  }
  return SITE_URL_PRODUCTION;
}
