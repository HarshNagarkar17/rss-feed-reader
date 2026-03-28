import { getCachedAggregatedFeeds } from "@/lib/server/feed-aggregation-cache"
import { parseClientFeedSources } from "@/lib/validate-feed-sources"

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const sources = parseClientFeedSources(body)
  if (!sources) {
    return Response.json(
      { error: "Send a non-empty sources array with id, name, and url." },
      { status: 400 }
    )
  }

  const data = await getCachedAggregatedFeeds(sources)
  return Response.json(data)
}
