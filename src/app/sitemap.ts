import type { MetadataRoute } from "next";
import { SITE_PUBLISHED, SITE_URL } from "@/constants/constants";
import { keptCollectionSlugs } from "@/data";

/**
 * The sitemap, served at `/sitemap.xml` (Next builds it from this file — see
 * `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md`).
 *
 * Eight URLs: the three fixed pages plus one per kept collection. The
 * collection list is derived from `keptCollectionSlugs`, the same constant
 * `generateStaticParams` prerenders from, so a sitemap entry cannot outlive
 * the page it points at or go missing when a collection is added — the two
 * are the same list or they are a bug.
 *
 * ## What is deliberately NOT here
 *  - `changeFrequency` and `priority`. Google has said for years that it
 *    ignores both, and this codebase already declines to emit markup that
 *    "reads correctly and does nothing" (see the JSON-LD note in layout.tsx
 *    on why the publish date is not an `article:published_time`). `lastmod`
 *    stays because Google does use it.
 *  - `?photo=<n>` lightbox deep links. They are the same document as the page
 *    they open over, and every page already declares a canonical pointing at
 *    its clean path. Listing 134 query-string variants would ask the crawler
 *    to index 134 near-duplicates of eight pages.
 *  - The photographs themselves. `images` entries are supported and would put
 *    the frames into Google Images, which is a real discovery channel for a
 *    photographer — but they resolve to the CDN host, not this origin, and
 *    cross-origin image sitemaps have their own Search Console requirements.
 *    Worth doing as its own change, with that verified first.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const collections = keptCollectionSlugs.map((slug) => ({
    url: `${SITE_URL}/collections/${slug}`,
    lastModified: SITE_PUBLISHED,
  }));

  return [
    { url: SITE_URL, lastModified: SITE_PUBLISHED },
    { url: `${SITE_URL}/collections`, lastModified: SITE_PUBLISHED },
    ...collections,
    { url: `${SITE_URL}/about`, lastModified: SITE_PUBLISHED },
  ];
}
