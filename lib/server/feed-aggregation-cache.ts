import { createHash } from "node:crypto"
import { unstable_cache } from "next/cache"
import { aggregateFeeds } from "@/lib/aggregate-feeds"
import { AGGREGATED_FEEDS_CACHE_SECONDS } from "@/lib/feed-constants"
import type { FeedSource } from "@/lib/feed-config"

function hashSourcesForCacheKey(sources: FeedSource[]): string {
  return createHash("sha256")
    .update(
      [...sources]
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((s) => `${s.id}\n${s.url}`)
        .join("\n--\n")
    )
    .digest("hex")
}

const LOG_PREFIX = "[feed-cache]"

function logCacheResult(
  hit: boolean,
  key: string,
  sourceCount: number
): void {
  const detail = {
    cacheKeyPrefix: key.slice(0, 12),
    sourceCount,
    ttlSeconds: AGGREGATED_FEEDS_CACHE_SECONDS,
  }
  if (hit) {
    console.info(`${LOG_PREFIX} HIT — served from Next.js incremental cache`, detail)
  } else {
    console.info(`${LOG_PREFIX} MISS — ran aggregateFeeds (RSS fetch + merge)`, detail)
  }
}

export async function getCachedAggregatedFeeds(sources: FeedSource[]) {
  const key = hashSourcesForCacheKey(sources)
  let ranUncachedFetcher = false
  const run = unstable_cache(
    async () => {
      ranUncachedFetcher = true
      return aggregateFeeds(sources)
    },
    ["reader-feeds", key],
    { revalidate: AGGREGATED_FEEDS_CACHE_SECONDS }
  )
  const data = await run()
  logCacheResult(!ranUncachedFetcher, key, sources.length)
  return data
}
