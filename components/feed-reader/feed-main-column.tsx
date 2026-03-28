"use client";

import { memo } from "react";
import { Loader2 } from "lucide-react";
import type { FeedSource } from "@/lib/feed-config";
import type { FeedArticle, FeedFetchError } from "@/lib/feed-types";
import { FeedArticleList } from "./feed-article-list";

export type FeedMainColumnProps = {
  sources: FeedSource[];
  /** All loaded articles (used for loading UI). */
  totalArticleCount: number;
  filteredArticles: FeedArticle[];
  activeSourceId: string | null;
  loading: boolean;
  fetchError: string | null;
  feedErrors: FeedFetchError[];
};

export const FeedMainColumn = memo(function FeedMainColumn({
  sources,
  totalArticleCount,
  filteredArticles,
  activeSourceId,
  loading,
  fetchError,
  feedErrors,
}: FeedMainColumnProps) {
  const activeName =
    activeSourceId === null
      ? null
      : (sources.find((s) => s.id === activeSourceId)?.name ?? null);

  return (
    <main className="min-w-0 flex-1 border-t border-border/40 pt-10 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-10 lg:pl-14">
      <header className="mb-12 max-w-xl">
        <h1 className="font-heading text-2xl font-light tracking-tight text-foreground sm:text-3xl">
          Reader
        </h1>
      </header>

      {fetchError ? (
        <p className="mb-8 text-[13px] text-destructive/90" role="alert">
          {fetchError}
        </p>
      ) : null}

      {feedErrors.length > 0 ? (
        <div
          className="mb-10 text-[12px] leading-relaxed text-muted-foreground"
          role="status"
        >
          <p className="text-foreground/80">Some sources failed.</p>
          <ul className="mt-2 space-y-1">
            {feedErrors.map((e) => (
              <li key={e.sourceId}>
                <span className="text-foreground/70">{e.sourceName}</span>
                <span className="text-muted-foreground/80"> — {e.message}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mb-8 flex items-center gap-2 text-[11px] tracking-wide text-muted-foreground uppercase">
        {loading && totalArticleCount === 0 ? (
          <>
            <Loader2 className="size-3 animate-spin opacity-50" aria-hidden />
            <span>Loading</span>
          </>
        ) : (
          <span>
            {filteredArticles.length}{" "}
            {filteredArticles.length === 1 ? "story" : "stories"}
            {activeName ? ` · ${activeName}` : null}
          </span>
        )}
        {loading && totalArticleCount > 0 ? (
          <Loader2
            className="size-3 animate-spin opacity-40"
            aria-label="Updating"
          />
        ) : null}
      </div>

      {filteredArticles.length === 0 && !loading ? (
        <p className="text-[13px] text-muted-foreground">
          Nothing here yet. Try another feed or check the URL points to RSS or
          Atom.
        </p>
      ) : null}

      <FeedArticleList articles={filteredArticles} />
    </main>
  );
});
