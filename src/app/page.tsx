import PageShell from "@/components/ui/PageShell";
import OverviewFeed from "@/components/OverviewFeed";
import IntroProvider from "@/components/intro/IntroContext";
import IntroOverlay from "@/components/intro/IntroOverlay";

export default function Home() {
  return (
    // The first-load intro (spec §5.1) wraps the real page rather than
    // gating it: PageShell/OverviewFeed always render their real content
    // immediately (no-JS/crawlers see the full page), and IntroOverlay is
    // purely an additive, client-only visual layered on top for returning
    // JS users on their first visit this session. See IntroContext for the
    // hydration-safety reasoning.
    <IntroProvider>
      <IntroOverlay />
      <PageShell>
        {/* Overview is a bare grid with no visible title, so the h1 is
            visually hidden — the page still needs one. */}
        <h1 className="sr-only">Kristina Bekher — photography overview</h1>
        <div className="w-full pt-[64px]">
          <OverviewFeed />
        </div>
      </PageShell>
    </IntroProvider>
  );
}
