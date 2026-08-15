import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import IndexList from "@/components/IndexList";

// Names the five collections rather than saying they exist. "Browse Kristina
// Bekher's film photography collections" matched nothing a person would type;
// "Harman Phoenix" and "expired ISO 25 film" are things people search for by
// name, and this is the page that should answer them.
const INDEX_DESCRIPTION =
  "Five film photography collections by Kristina Bekher: black and white, the Swiss Alps, Harman Phoenix, European cities, and expired ISO 25 film.";

export const metadata: Metadata = {
  alternates: { canonical: "/collections" },
  title: "Index — Kristina Bekher",
  description: INDEX_DESCRIPTION,
  // Declared for the same reason as /about's — see the note there.
  openGraph: {
    title: "Index — Kristina Bekher",
    description: INDEX_DESCRIPTION,
    url: "/collections",
  },
  twitter: {
    title: "Index — Kristina Bekher",
    description: INDEX_DESCRIPTION,
  },
};

export default function IndexPage() {
  return (
    <PageShell>
      {/* The design shows no visible page title, but every route still needs
          an h1 so screen-reader users get a valid heading hierarchy. */}
      <h1 className="sr-only">Index — photography collections</h1>
      <IndexList />
    </PageShell>
  );
}
