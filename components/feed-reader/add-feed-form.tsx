"use client";

import { memo } from "react";
import { Plus } from "lucide-react";

export type AddFeedFormProps = {
  urlValue: string;
  onUrlChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  error: string | null;
};

export const AddFeedForm = memo(function AddFeedForm({
  urlValue,
  onUrlChange,
  onSubmit,
  error,
}: AddFeedFormProps) {
  return (
    <div className="mt-10 border-t border-border/40 pt-8">
      <p className="mb-1 text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
        Add a feed
      </p>
      <p className="mb-4 text-[11px] leading-relaxed text-muted-foreground/85">
        RSS or Atom URL
      </p>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          id="feed-url"
          type="url"
          inputMode="url"
          autoComplete="url"
          placeholder="https://example.com/feed.xml"
          value={urlValue}
          onChange={(e) => onUrlChange(e.target.value)}
          aria-label="RSS or Atom feed URL"
          className="w-full rounded-md border border-border/45 bg-transparent px-3 py-2 text-[13px] text-foreground transition-colors placeholder:text-muted-foreground/45 focus-visible:border-foreground/25 focus-visible:outline-none"
        />
        {error ? (
          <p className="text-[11px] leading-snug text-destructive/90">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border/50 py-2 text-[12px] font-medium text-foreground transition-colors hover:border-foreground/20 hover:bg-foreground/[0.03] active:bg-foreground/[0.05]"
        >
          <Plus className="size-3.5" strokeWidth={1.75} aria-hidden />
          Add feed
        </button>
      </form>
    </div>
  );
});
