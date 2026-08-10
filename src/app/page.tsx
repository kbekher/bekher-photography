import PageShell from "@/components/ui/PageShell";
import OverviewFeed from "@/components/OverviewFeed";

export default function Home() {
  return (
    <PageShell>
      <div className="w-full pt-[138px]">
        <OverviewFeed />
      </div>
    </PageShell>
  );
}
