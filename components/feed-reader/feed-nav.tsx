"use client";

import { memo } from "react";
import { Trash2 } from "lucide-react";
import type { FeedSource } from "@/lib/feed-config";
import type { FeedArticle } from "@/lib/feed-types";
import { cn } from "@/lib/utils";

export type FeedNavProps = {
  sources: FeedSource[];
  articles: FeedArticle[];
  activeSourceId: string | null;
  onSelectAll: () => void;
  onSelectSource: (id: string) => void;
  onRemoveSource: (id: string) => void;
};

function navRowClass(active: boolean) {
  return cn(
    "flex w-full items-center gap-2 rounded-md py-1.5 pr-1 text-left text-[13px] transition-colors",
    active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
  );
}

export const FeedNav = memo(function FeedNav({
  sources,
  articles,
  activeSourceId,
  onSelectAll,
  onSelectSource,
  onRemoveSource,
}: FeedNavProps) {
  return (
    <nav aria-label="Feeds" className="flex flex-col gap-0.5">
      <p className="mb-4 text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
        Feeds
      </p>
      <button
        type="button"
        onClick={onSelectAll}
        className={navRowClass(activeSourceId === null)}
      >
        <span
          className={cn(
            "h-px w-3 shrink-0 transition-colors",
            activeSourceId === null ? "bg-foreground" : "bg-transparent",
          )}
          aria-hidden
        />
        All
        <span className="ml-auto tabular-nums text-[11px] text-muted-foreground/70">
          {articles.length}
        </span>
      </button>
      {sources.map((s) => {
        const count = articles.filter((a) => a.sourceId === s.id).length;
        const active = activeSourceId === s.id;
        return (
          <div key={s.id} className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => onSelectSource(s.id)}
              className={cn(navRowClass(active), "min-w-0 flex-1")}
              title={s.url}
            >
              <span
                className={cn(
                  "h-px w-3 shrink-0 transition-colors",
                  active ? "bg-foreground" : "bg-transparent",
                )}
                aria-hidden
              />
              <span className="truncate">{s.name}</span>
              <span className="ml-auto shrink-0 tabular-nums text-[11px] text-muted-foreground/70">
                {count}
              </span>
            </button>
            <button
              type="button"
              className="rounded p-1.5 text-muted-foreground/35 transition-colors hover:bg-foreground/[0.04] hover:text-muted-foreground"
              aria-label={`Remove ${s.name}`}
              onClick={() => onRemoveSource(s.id)}
            >
              <Trash2 className="size-3.5" strokeWidth={1.5} />
            </button>
          </div>
        );
      })}
    </nav>
  );
});
