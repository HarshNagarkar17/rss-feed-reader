import Parser from "rss-parser"
import type { FeedSource } from "./feed-config"
import type {
  AggregatedFeeds,
  FeedArticle,
  FeedChannelInfo,
  FeedFetchError,
} from "./feed-types"
import { decodeBasicXmlEntities, stripHtmlTags } from "./rss-text"

const FETCH_MS = 14_000
const ITEMS_PER_SOURCE = 14

const parser = new Parser({
  timeout: FETCH_MS,
  headers: {
    "User-Agent": "TechRSSReader/1.0",
    Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
  },
})

function parseDate(item: { isoDate?: string; pubDate?: string }): Date {
  if (item.isoDate) {
    const d = new Date(item.isoDate)
    if (!Number.isNaN(d.getTime())) return d
  }
  if (item.pubDate) {
    const d = new Date(item.pubDate)
    if (!Number.isNaN(d.getTime())) return d
  }
  return new Date(0)
}

async function fetchOneSource(source: FeedSource): Promise<{
  articles: FeedArticle[]
  channel?: FeedChannelInfo
  error?: FeedFetchError
}> {
  try {
    const feed = await Promise.race([
      parser.parseURL(source.url),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Feed request timed out")), FETCH_MS)
      ),
    ])

    const rawTitle = feed.title?.trim()
    const channel: FeedChannelInfo | undefined = rawTitle
      ? {
        sourceId: source.id,
        title: decodeBasicXmlEntities(stripHtmlTags(rawTitle)),
      }
      : undefined

    const items = (feed.items ?? []).slice(0, ITEMS_PER_SOURCE)
    const articles: FeedArticle[] = []

    for (const item of items) {
      const link = item.link?.trim()
      if (!link) continue

      const titleRaw = item.title?.trim() || "Untitled"
      const title = decodeBasicXmlEntities(stripHtmlTags(titleRaw))
      const snippetRaw =
        item.contentSnippet ?? item.summary ?? item.content ?? ""
      const summary = snippetRaw
        ? decodeBasicXmlEntities(stripHtmlTags(snippetRaw)).slice(0, 280)
        : undefined

      const publishedAt = parseDate(item).toISOString()
      const id = `${source.id}:${encodeURIComponent(link)}`

      articles.push({
        id,
        title,
        link,
        publishedAt,
        sourceId: source.id,
        sourceName: source.name,
        summary,
      })
    }

    return { articles, channel }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error"
    return {
      articles: [],
      error: { sourceId: source.id, sourceName: source.name, message },
    }
  }
}

export async function aggregateFeeds(sources: FeedSource[]): Promise<AggregatedFeeds> {
  const results = await Promise.all(sources.map((s) => fetchOneSource(s)))

  const articles: FeedArticle[] = []
  const errors: FeedFetchError[] = []
  const channels: FeedChannelInfo[] = []

  for (const r of results) {
    articles.push(...r.articles)
    if (r.error) errors.push(r.error)
    if (r.channel) channels.push(r.channel)
  }

  articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  return { articles, errors, channels }
}
