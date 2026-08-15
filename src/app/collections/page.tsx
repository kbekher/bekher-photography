import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import IndexList from "@/components/IndexList";

export const metadata: Metadata = {
  alternates: { canonical: "/collections" },
  title: "Index — Kristina Bekher",
  description: "Browse Kristina Bekher's film photography collections.",
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
