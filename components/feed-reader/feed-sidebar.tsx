"use client"

import { memo } from "react"
import type { FeedSource } from "@/lib/feed-config"
import type { FeedArticle } from "@/lib/feed-types"
import { AddFeedForm } from "./add-feed-form"
import { FeedNav } from "./feed-nav"

export type FeedSidebarProps = {
  sources: FeedSource[]
  articles: FeedArticle[]
  activeSourceId: string | null
  onSelectAll: () => void
  onSelectSource: (id: string) => void
  onRemoveSource: (id: string) => void
  urlInput: string
  onUrlInputChange: (value: string) => void
  onAddSubmit: (event: React.FormEvent) => void
  addError: string | null
}

export const FeedSidebar = memo(function FeedSidebar({
  sources,
  articles,
  activeSourceId,
  onSelectAll,
  onSelectSource,
  onRemoveSource,
  urlInput,
  onUrlInputChange,
  onAddSubmit,
  addError,
}: FeedSidebarProps) {
  return (
    <aside className="shrink-0 sm:sticky sm:top-8 sm:z-10 sm:max-h-[calc(100dvh-4rem)] sm:w-56 sm:overflow-y-auto sm:pr-8 sm:self-start lg:w-60 lg:pr-10">
      <FeedNav
        sources={sources}
        articles={articles}
        activeSourceId={activeSourceId}
        onSelectAll={onSelectAll}
        onSelectSource={onSelectSource}
        onRemoveSource={onRemoveSource}
      />
      <AddFeedForm
        urlValue={urlInput}
        onUrlChange={onUrlInputChange}
        onSubmit={onAddSubmit}
        error={addError}
      />
    </aside>
  )
})
