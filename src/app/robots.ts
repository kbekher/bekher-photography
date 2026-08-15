import type { MetadataRoute } from "next";
import { SITE_URL } from "@/constants/constants";

/**
 * `/robots.txt`. Everything is crawlable — this is a public portfolio whose
 * whole purpose is to be found, and there is no admin area, no user content
 * and no paywall to keep out of the index.
 *
 * The one line that actually earns its place is `Sitemap:`. A sitemap Google
 * has not been told about is only discovered if it happens to guess the
 * conventional path or the site is submitted in Search Console by hand; this
 * points every crawler at it on the first request, without any manual step.
 *
 * ## Not blocking the AI crawlers
 * GPTBot, CCBot, Google-Extended and friends are all allowed, by omission. It
 * is a real choice and a reversible one — add a rule here to opt out — but
 * blocking them also removes the work from the AI search surfaces people
 * increasingly use to find photographers, and these same photographs are
 * already published for free download on Unsplash and Pexels. Opting out here
 * while giving them away there would protect nothing.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    // Which of www/apex is canonical. Yandex is the main consumer; harmless
    // elsewhere, and it keeps the answer in the same file as the sitemap URL.
    host: SITE_URL,
  };
}
