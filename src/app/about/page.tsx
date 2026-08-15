import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import AboutContent from "@/components/AboutContent";

// "Read about her work and get in touch" described the page's own navigation
// rather than anything a person searches for. The two things that actually
// bring strangers to a photographer's about page are how to reach her and
// whether the images can be used — both are on this page, so both are here.
const ABOUT_DESCRIPTION =
  "About Kristina Bekher — a Ukrainian film photographer and software engineer based in Germany. Get in touch, or download her photos free on Unsplash and Pexels.";

export const metadata: Metadata = {
  // Own canonical, not the root layout's — see the note there.
  alternates: { canonical: "/about" },
  title: "About — Kristina Bekher",
  description: ABOUT_DESCRIPTION,
  // Declared, not inherited. App Router merges `openGraph` wholesale from the
  // root layout, so without this block a shared /about link unfurled with the
  // HOME page's title and description — the one card that says nothing about
  // the page being shared. Images still come from the root, correctly: the OG
  // photo is hero.jpg, which is this page's portrait.
  openGraph: {
    title: "About — Kristina Bekher",
    description: ABOUT_DESCRIPTION,
    url: "/about",
  },
  twitter: {
    title: "About — Kristina Bekher",
    description: ABOUT_DESCRIPTION,
  },
};

export default function About() {
  return (
    <PageShell>
      {/* AboutContent's visible "About"/"Contact"/"Download images on" labels
          are h2s; this gives them a parent so the hierarchy isn't broken. */}
      <h1 className="sr-only">About Kristina Bekher</h1>
      <AboutContent />
    </PageShell>
  );
}
