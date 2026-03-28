/** Max feeds per user list (client + server validation). */
export const MAX_FEEDS = 30

export const MAX_FEED_URL_LENGTH = 2048

export const FEEDS_API_PATH = "/api/feeds" as const

/** Next.js Data Cache TTL for aggregated feed responses */
export const AGGREGATED_FEEDS_CACHE_SECONDS = 300
