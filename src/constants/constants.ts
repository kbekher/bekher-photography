export const DOMAIN = '';

/**
 * The canonical origin, with no trailing slash.
 *
 * Lives here rather than in `layout.tsx` because it is no longer only the
 * layout's business: `sitemap.ts` builds every `<loc>` from it and `robots.ts`
 * points at the sitemap with it, and a sitemap that disagrees with the site's
 * own canonicals about the hostname is worse than no sitemap — it invites the
 * crawler to treat www and apex as two sites.
 *
 * `www` is deliberate and must match `metadataBase`: pick one host and never
 * emit the other.
 */
export const SITE_URL = 'https://www.kristinabekher.com';

/**
 * Site-wide publication date.
 *
 * A LITERAL, deliberately — never `new Date()`. A date computed at build time
 * would move on every deploy, telling crawlers the site had been republished
 * each time a typo was fixed, which is both untrue and the kind of signal that
 * gets discounted once noticed. This is the `<lastmod>` every sitemap entry
 * carries and the `datePublished` in the site's JSON-LD. Edit it when the site
 * is genuinely republished, and not otherwise.
 */
export const SITE_PUBLISHED = '2026-08-15';

/**
 * Where the photo resizer is reached.
 *
 * ## Why this is configuration and not a constant
 * The resizer itself is a Lambda Function URL, and a Function URL is a poor
 * thing to hand a photo gallery directly to a browser:
 *  - it speaks HTTP/1.1 only, so the browser's ~6-connections-per-origin cap
 *    applies and the home page's tiles queue in waves rather than
 *    multiplexing;
 *  - there is no edge cache in front of it, so every request invokes the
 *    function, from eu-central-1, wherever the visitor happens to be.
 * Both disappear the moment the same path is served through CloudFront, which
 * is HTTP/2 and caches at the PoP — and the responses already carry
 * `cache-control: public, max-age=31536000, immutable`, so they are safe to
 * cache at an edge without any further coordination.
 *
 * So the ORIGIN is an env var and the Function URL is only the fallback. The
 * switch is then a deploy-time change, revertible in the same place it was
 * made, instead of a code edit — which matters because the failure mode of
 * getting it wrong is every photo on the site 404ing at once.
 *
 * `NEXT_PUBLIC_` because `imageLoader` runs in the browser; Next inlines the
 * value at build time, so it must be a literal member access, not a lookup.
 *
 * Set it to the CDN's ORIGIN only — no path. The `/img/film-gallery` prefix
 * stays here on purpose: CloudFront should forward the path through
 * unchanged (an empty "origin path" and an `/img/*` behavior), so exactly one
 * thing differs between the two setups, the hostname. Any query string the
 * loader appends (`w`, `q`, `f`) MUST be part of the cache key, or every
 * width collapses onto whichever one warmed the cache first.
 */
/**
 * The CDN, not the Function URL behind it.
 *
 * It used to be the Lambda's own URL, on the reasoning that the origin of
 * record is the safest thing to fall back to. That stopped being true the
 * moment the Function URL was switched to `AWS_IAM` and put behind an origin
 * access control: it now answers 403 to anything that isn't a signed request
 * from one of the two CloudFront distributions. A fallback nothing can reach
 * is not a fallback — it just moved the failure from "env var missing" to
 * "every image on the page is broken", which is exactly what it did to local
 * development.
 */
const IMG_ORIGIN_FALLBACK = 'https://d14lj85n4pdzvr.cloudfront.net';

const IMG_ORIGIN = (process.env.NEXT_PUBLIC_IMG_ORIGIN || IMG_ORIGIN_FALLBACK)
  // A trailing slash here would produce `//img/...`, which S3-backed origins
  // treat as a different (empty-named) key and reject. Cheap to tolerate.
  .replace(/\/+$/, '');

export const LAMBDA_IMG_BASE = `${IMG_ORIGIN}/img/film-gallery`;
