import { MAX_FEEDS } from "./feed-constants"
import type { FeedSource } from "./feed-config"
import { displayFeedHost } from "./feed-utils"
import { normalizeFeedUrl, stableIdForUrl } from "./validate-feed-sources"

export type NewFeedInput = { id: string; name: string; url: string }

/**
 * Returns an error message if the URL cannot be added; otherwise the normalized feed row.
 */
export function tryCreateFeedFromInput(
  rawUrl: string,
  existing: FeedSource[]
): { ok: true; feed: NewFeedInput } | { ok: false; error: string } {
  let url: string
  try {
    url = normalizeFeedUrl(rawUrl)
  } catch {
    return { ok: false, error: "Invalid URL." }
  }
  if (!url) {
    return { ok: false, error: "Enter a feed URL." }
  }
  if (existing.some((s) => s.url === url)) {
    return { ok: false, error: "Already added." }
  }
  if (existing.length >= MAX_FEEDS) {
    return { ok: false, error: `Maximum ${MAX_FEEDS} feeds.` }
  }
  return {
    ok: true,
    feed: {
      id: stableIdForUrl(url),
      name: displayFeedHost(url),
      url,
    },
  }
}
