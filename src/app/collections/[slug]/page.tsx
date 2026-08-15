import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageShell from "@/components/ui/PageShell";
import PillButton from "@/components/ui/PillButton";
import CollectionContent from "@/components/CollectionContent";
import { galleriesData, keptCollectionSlugs, type CollectionSlug } from "@/data";
import { LAMBDA_IMG_BASE } from "@/constants/constants";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

function isKeptSlug(slug: string): slug is CollectionSlug {
  return (keptCollectionSlugs as readonly string[]).includes(slug);
}

/** Prerender all 5 kept collections at build time (spec §4.3, §7). */
export function generateStaticParams() {
  return keptCollectionSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isKeptSlug(slug)) return {};

  const gallery = galleriesData[slug];
  const cover = gallery.photos[0];
  const title = `${gallery.name} — Kristina Bekher`;

  // Route the OG image through the same resizer every other image on the site
  // uses (see src/utils/image-loader.ts) rather than adding a second image
  // pipeline. Width/height are deliberately omitted: the resizer is asked for
  // a 1200px-wide render, but the source photo is 2:3 or 3:2 (never the
  // 1200x630 OG convention), so publishing a fixed height would misdescribe
  // the actual image. Crawlers fall back to the image's real dimensions.
  //
  // `f=jpeg`, unlike the webp served to browsers: scrapers are not browsers,
  // and Facebook and LinkedIn in particular still treat webp as unsupported
  // for `og:image` and will show no preview at all. This is one image fetched
  // by a crawler, so its bytes do not matter; unfurling at all does.
  const ogImageUrl = `${LAMBDA_IMG_BASE}/${slug}/${cover.path}?w=1200&q=90&f=jpeg`;
  const canonicalPath = `/collections/${slug}`;

  return {
    title,
    description: gallery.description,
    // Declared per collection — the root layout's canonical is inherited
    // otherwise, and every collection would claim to be the home page.
    alternates: { canonical: canonicalPath },
    openGraph: {
      title,
      description: gallery.description,
      url: canonicalPath,
      images: [{ url: ogImageUrl, alt: gallery.name }],
    },
  };
}

/**
 * Collection detail page (spec §4.3) — server component. Validates the slug
 * against the 5 kept collections and 404s otherwise, resolves the
 * previous/next collection for the footer nav pair, and hands everything to
 * `CollectionContent` (which owns layout + the lightbox wiring).
 *
 * Previous/next WRAP around `keptCollectionSlugs` (there are only 5, and the
 * spec gives no "first/last" treatment for this pair, unlike the Overview
 * feed's one-directional "View previous"). Wrapping means both buttons are
 * always enabled real links, which sidesteps the disabled-button-vs-
 * keyboard-focus-trap tradeoff entirely rather than working around it.
 */
export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;

  if (!isKeptSlug(slug)) {
    notFound();
  }

  const gallery = galleriesData[slug];
  const index = keptCollectionSlugs.indexOf(slug);
  const total = keptCollectionSlugs.length;
  const prevSlug = keptCollectionSlugs[(index - 1 + total) % total];
  const nextSlug = keptCollectionSlugs[(index + 1) % total];

  return (
    <PageShell
      navTrailing={
        <span className="hidden lg:block">
          <PillButton href="/collections">Back</PillButton>
        </span>
      }
    >
      <CollectionContent
        gallery={gallery}
        slug={slug}
        backHref="/collections"
        prevHref={`/collections/${prevSlug}`}
        nextHref={`/collections/${nextSlug}`}
      />
    </PageShell>
  );
}
