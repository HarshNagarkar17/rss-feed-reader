export type FeedArticle = {
  id: string
  title: string
  link: string
  publishedAt: string
  sourceId: string
  sourceName: string
  summary?: string
}

export type FeedFetchError = {
  sourceId: string
  sourceName: string
  message: string
}

export type FeedChannelInfo = {
  sourceId: string
  title: string
}

export type AggregatedFeeds = {
  articles: FeedArticle[]
  errors: FeedFetchError[]
  /** RSS/Atom channel titles for labeling feeds after fetch */
  channels: FeedChannelInfo[]
}

/** POST /api/feeds error shape */
export type FeedsApiErrorJson = {
  error: string
}
