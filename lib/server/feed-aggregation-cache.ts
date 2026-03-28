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

export function getCachedAggregatedFeeds(sources: FeedSource[]) {
  const key = hashSourcesForCacheKey(sources)
  const run = unstable_cache(
    async () => aggregateFeeds(sources),
    ["reader-feeds", key],
    { revalidate: AGGREGATED_FEEDS_CACHE_SECONDS }
  )
  return run()
}
