"use client";

import { useCallback, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { DEFAULT_FEEDS } from "@/lib/feed-config";
import { tryCreateFeedFromInput } from "@/lib/feed-add-validation";
import { useFeedReader } from "@/hooks/use-feed-reader";
import { FeedMainColumn } from "./feed-main-column";
import { FeedSidebar } from "./feed-sidebar";

export function FeedReaderApp() {
  const { sources, setSources, articles, errors, loading, fetchError } =
    useFeedReader();

  const [activeSourceId, setActiveSourceId] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [addError, setAddError] = useState<string | null>(null);

  const filteredArticles = useMemo(() => {
    if (!sources) return [];
    if (activeSourceId === null) return articles;
    return articles.filter((a) => a.sourceId === activeSourceId);
  }, [articles, activeSourceId, sources]);

  const handleAddFeed = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      setAddError(null);
      if (!sources) return;
      const result = tryCreateFeedFromInput(urlInput, sources);
      if (!result.ok) {
        setAddError(result.error);
        return;
      }
      setSources((prev) => (prev ? [...prev, result.feed] : prev));
      setUrlInput("");
    },
    [sources, setSources, urlInput],
  );

  const handleRemoveFeed = useCallback(
    (id: string) => {
      setSources((prev) => {
        if (!prev) return prev;
        const next = prev.filter((s) => s.id !== id);
        return next.length > 0 ? next : DEFAULT_FEEDS;
      });
      setActiveSourceId((cur) => (cur === id ? null : cur));
    },
    [setSources],
  );

  const handleSelectAllFeeds = useCallback(() => {
    setActiveSourceId(null);
  }, []);

  if (!sources) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Loader2
          className="size-5 animate-spin text-muted-foreground/50"
          aria-label="Loading"
        />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-muted/25">
      <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col gap-12 px-5 py-12 sm:flex-row sm:items-start sm:gap-0 sm:px-8 sm:py-16 lg:px-12">
        <FeedSidebar
          sources={sources}
          articles={articles}
          activeSourceId={activeSourceId}
          onSelectAll={handleSelectAllFeeds}
          onSelectSource={setActiveSourceId}
          onRemoveSource={handleRemoveFeed}
          urlInput={urlInput}
          onUrlInputChange={setUrlInput}
          onAddSubmit={handleAddFeed}
          addError={addError}
        />
        <FeedMainColumn
          sources={sources}
          totalArticleCount={articles.length}
          filteredArticles={filteredArticles}
          activeSourceId={activeSourceId}
          loading={loading}
          fetchError={fetchError}
          feedErrors={errors}
        />
      </div>
    </div>
  );
}
