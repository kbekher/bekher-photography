export const DOMAIN = '';

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
const IMG_ORIGIN_FALLBACK =
  'https://tojp4f5baeta7girwrpqvogul40oddhk.lambda-url.eu-central-1.on.aws';

const IMG_ORIGIN = (process.env.NEXT_PUBLIC_IMG_ORIGIN || IMG_ORIGIN_FALLBACK)
  // A trailing slash here would produce `//img/...`, which S3-backed origins
  // treat as a different (empty-named) key and reject. Cheap to tolerate.
  .replace(/\/+$/, '');

export const LAMBDA_IMG_BASE = `${IMG_ORIGIN}/img/film-gallery`;
