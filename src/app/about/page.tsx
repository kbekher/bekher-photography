import type { Metadata } from "next";
import PageShell from "@/components/ui/PageShell";
import AboutContent from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "About — Kristina Bekher",
  description:
    "Kristina Bekher is a Ukrainian photographer and software engineer based in Germany. Read about her work and get in touch.",
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
