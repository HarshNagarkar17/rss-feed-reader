"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  DEFAULT_FEEDS,
  FEED_STORAGE_KEY,
  type FeedSource,
} from "@/lib/feed-config"
import { requestAggregatedFeeds } from "@/lib/feed-client-api"
import type { FeedArticle, FeedFetchError } from "@/lib/feed-types"
import { feedSourcesFetchKey, mergeChannelTitlesIntoSources } from "@/lib/feed-utils"
import { parseStoredFeedSourcesJson } from "@/lib/validate-feed-sources"

/**
 * Owns feed list (localStorage + defaults), aggregated articles from `/api/feeds`,
 * and loading/error state. Refetches only when the id+url set of sources changes.
 */
export function useFeedReader(): {
  sources: FeedSource[] | null
  setSources: React.Dispatch<React.SetStateAction<FeedSource[] | null>>
  articles: FeedArticle[]
  errors: FeedFetchError[]
  loading: boolean
  fetchError: string | null
} {
  const [sources, setSources] = useState<FeedSource[] | null>(null)
  const [ready, setReady] = useState(false)
  const [articles, setArticles] = useState<FeedArticle[]>([])
  const [errors, setErrors] = useState<FeedFetchError[]>([])
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const sourcesRef = useRef<FeedSource[] | null>(null)

  useEffect(() => {
    sourcesRef.current = sources
  }, [sources])

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- browser-only hydration */
    try {
      const raw = localStorage.getItem(FEED_STORAGE_KEY)
      if (raw) {
        const parsed = parseStoredFeedSourcesJson(JSON.parse(raw) as unknown)
        if (parsed?.length) {
          setSources(parsed)
          setReady(true)
          return
        }
      }
    } catch {
      /* fall through to defaults */
    }
    setSources(DEFAULT_FEEDS)
    setReady(true)
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [])

  useEffect(() => {
    if (!ready || !sources?.length) return
    try {
      localStorage.setItem(FEED_STORAGE_KEY, JSON.stringify(sources))
    } catch {
      /* quota / private mode */
    }
  }, [sources, ready])

  const fetchKey = useMemo(
    () => (sources?.length ? feedSourcesFetchKey(sources) : ""),
    [sources]
  )

  useEffect(() => {
    if (!ready || !fetchKey) return

    const payload = sourcesRef.current
    if (!payload?.length) return

    let cancelled = false

    /* eslint-disable react-hooks/set-state-in-effect -- remote sync on fetchKey */
    setLoading(true)
    setFetchError(null)
    /* eslint-enable react-hooks/set-state-in-effect */

    void requestAggregatedFeeds(payload).then((result) => {
      if (cancelled) return

      if (!result.ok) {
        setArticles([])
        setErrors([])
        setFetchError(result.error)
        setLoading(false)
        return
      }

      const { articles: nextArticles, errors: nextErrors, channels } =
        result.data
      setArticles(nextArticles)
      setErrors(nextErrors)
      setFetchError(null)
      setLoading(false)

      if (channels.length > 0) {
        setSources((prev) => {
          if (!prev) return prev
          return mergeChannelTitlesIntoSources(prev, channels)
        })
      }
    })

    return () => {
      cancelled = true
    }
  }, [fetchKey, ready])

  return {
    sources,
    setSources,
    articles,
    errors,
    loading,
    fetchError,
  }
}
