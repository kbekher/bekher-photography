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
      <AboutContent />
    </PageShell>
  );
}
