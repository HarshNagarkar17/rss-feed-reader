import type { FeedSource } from "./feed-config"
import type { FeedChannelInfo } from "./feed-types"

/** Stable key when id+url set changes (ignores display name updates). */
export function feedSourcesFetchKey(sources: FeedSource[]): string {
  if (sources.length === 0) return ""
  return sources.map((s) => `${s.id}:${s.url}`).join("|")
}

export function formatArticleDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const now = new Date()
  const sameYear = d.getFullYear() === now.getFullYear()
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
  }).format(d)
}

export function displayFeedHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}

/**
 * Applies RSS channel titles to sources. Returns the same array reference if nothing changed
 * (avoids extra re-renders and localStorage writes).
 */
export function mergeChannelTitlesIntoSources(
  sources: FeedSource[],
  channels: FeedChannelInfo[]
): FeedSource[] {
  if (channels.length === 0) return sources

  const titles = new Map(channels.map((c) => [c.sourceId, c.title]))
  let changed = false
  const next = sources.map((s) => {
    const title = titles.get(s.id)
    if (title && title !== s.name) {
      changed = true
      return { ...s, name: title }
    }
    return s
  })
  return changed ? next : sources
}
