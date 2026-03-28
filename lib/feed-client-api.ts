import type { FeedSource } from "./feed-config"
import { FEEDS_API_PATH } from "./feed-constants"
import type { AggregatedFeeds, FeedsApiErrorJson } from "./feed-types"

type RequestResult =
  | { ok: true; data: AggregatedFeeds }
  | { ok: false; error: string }

/**
 * Fetches aggregated RSS from the App Router API (server-side fetch + cache).
 */
export async function requestAggregatedFeeds(
  sources: FeedSource[]
): Promise<RequestResult> {
  try {
    const res = await fetch(FEEDS_API_PATH, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sources } satisfies { sources: FeedSource[] }),
    })

    const json = (await res.json()) as Partial<AggregatedFeeds> & FeedsApiErrorJson

    if (!res.ok) {
      return {
        ok: false,
        error: json.error ?? "Could not load feeds",
      }
    }

    return {
      ok: true,
      data: {
        articles: json.articles ?? [],
        errors: json.errors ?? [],
        channels: json.channels ?? [],
      },
    }
  } catch {
    return { ok: false, error: "Network error while loading feeds" }
  }
}
