import PageShell from "@/components/ui/PageShell";

export default async function Collection({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <PageShell>
      <p>Collection: {slug} — coming soon.</p>
    </PageShell>
  );
}
