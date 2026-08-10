import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import IndexList from "@/components/IndexList";

export const metadata: Metadata = {
  title: "Index — Kristina Bekher",
  description: "Browse Kristina Bekher's film photography collections.",
};

export default function IndexPage() {
  return (
    <PageShell>
      <IndexList />
    </PageShell>
  );
}
