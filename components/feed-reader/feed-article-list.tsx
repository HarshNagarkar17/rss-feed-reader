"use client";

import { memo } from "react";
import { ArrowUpRight } from "lucide-react";
import type { FeedArticle } from "@/lib/feed-types";
import { formatArticleDate } from "@/lib/feed-utils";
import { cn } from "@/lib/utils";

export type FeedArticleListProps = {
  articles: FeedArticle[];
};

export const FeedArticleList = memo(function FeedArticleList({
  articles,
}: FeedArticleListProps) {
  if (articles.length === 0) return null;

  return (
    <ul className="m-0 max-w-2xl list-none space-y-0 p-0">
      {articles.map((article) => (
        <li
          key={article.id}
          className="border-b border-border/35 py-8 first:pt-0 last:border-0"
        >
          <article>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                {article.sourceName}
              </span>
              <time
                className="text-[11px] tabular-nums text-muted-foreground"
                dateTime={article.publishedAt}
              >
                {formatArticleDate(article.publishedAt)}
              </time>
            </div>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link mt-2.5 flex items-start gap-2 text-pretty"
            >
              <span
                className={cn(
                  "text-[17px] font-medium leading-snug tracking-tight text-foreground transition-opacity sm:text-lg",
                  "group-hover/link:opacity-90",
                )}
              >
                {article.title}
              </span>
              <ArrowUpRight
                className="mt-0.5 size-4 shrink-0 text-muted-foreground/55 transition-colors group-hover/link:text-foreground/70"
                strokeWidth={1.25}
                aria-hidden
              />
            </a>
            {article.summary ? (
              <p className="mt-3 max-w-prose text-[13px] leading-[1.65] text-muted-foreground line-clamp-2">
                {article.summary}
              </p>
            ) : null}
          </article>
        </li>
      ))}
    </ul>
  );
});
