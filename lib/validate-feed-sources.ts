import type { FeedSource } from "./feed-config"
import { MAX_FEED_URL_LENGTH, MAX_FEEDS } from "./feed-constants"

function isAllowedUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === "https:" || u.protocol === "http:"
  } catch {
    return false
  }
}

function isPlainFeedSourceRow(x: unknown): x is {
  id: string
  name: string
  url: string
} {
  if (x === null || typeof x !== "object") return false
  const o = x as Record<string, unknown>
  return (
    typeof o.id === "string" &&
    o.id.length > 0 &&
    o.id.length <= 128 &&
    typeof o.name === "string" &&
    o.name.length > 0 &&
    o.name.length <= 200 &&
    typeof o.url === "string" &&
    o.url.length > 0 &&
    o.url.length <= MAX_FEED_URL_LENGTH
  )
}

/** Normalize URL for deduplication (trim, default https). */
export function normalizeFeedUrl(input: string): string {
  let s = input.trim()
  if (!s) return ""
  if (!/^https?:\/\//i.test(s)) s = `https://${s}`
  const u = new URL(s)
  u.hash = ""
  return u.toString()
}

export function stableIdForUrl(url: string): string {
  let h = 0
  for (let i = 0; i < url.length; i++) {
    h = Math.imul(31, h) + url.charCodeAt(i) | 0
  }
  return `u${(h >>> 0).toString(36)}`
}

function normalizeSourceList(rows: unknown[]): FeedSource[] | null {
  const out: FeedSource[] = []
  const seenUrls = new Set<string>()

  for (const item of rows) {
    if (!isPlainFeedSourceRow(item)) continue
    let url: string
    try {
      url = normalizeFeedUrl(item.url)
    } catch {
      continue
    }
    if (!isAllowedUrl(url)) continue
    if (seenUrls.has(url)) continue
    seenUrls.add(url)
    out.push({
      id: item.id.slice(0, 128),
      name: item.name.slice(0, 200),
      url,
    })
    if (out.length >= MAX_FEEDS) break
  }

  return out.length > 0 ? out : null
}

/** Parse and validate body.sources from the API (untrusted). */
export function parseClientFeedSources(raw: unknown): FeedSource[] | null {
  if (raw === null || typeof raw !== "object") return null
  const body = raw as { sources?: unknown }
  if (!Array.isArray(body.sources)) return null
  return normalizeSourceList(body.sources)
}

/** Parse localStorage JSON array of feeds (untrusted). */
export function parseStoredFeedSourcesJson(data: unknown): FeedSource[] | null {
  if (!Array.isArray(data)) return null
  return normalizeSourceList(data)
}

