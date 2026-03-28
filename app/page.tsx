import { FeedReaderApp } from "@/components/feed-reader/feed-reader-app";
import { getSiteUrl } from "@/lib/site";

const jsonLd = (() => {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Tech feed reader",
    description:
      "Aggregated tech news from Hacker News, TechCrunch, The Verge, and your own RSS feeds in one place.",
    url,
    inLanguage: "en",
  };
})();

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FeedReaderApp />
    </>
  );
}
