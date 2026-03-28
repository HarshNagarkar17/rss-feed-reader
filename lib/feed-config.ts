export type FeedSource = {
  id: string
  name: string
  url: string
}

/** localStorage key for the user's feed list */
export const FEED_STORAGE_KEY = "tech-feed-reader-sources-v1"

/** Shipped defaults when nothing is stored yet */
export const DEFAULT_FEEDS: FeedSource[] = [
  {
    id: "hackernews",
    name: "Hacker News",
    url: "https://hnrss.org/frontpage",
  },
  {
    id: "techcrunch",
    name: "TechCrunch",
    url: "https://techcrunch.com/feed/",
  },
]
