import { PRESS_RELEASES } from "@/data/pressReleases";
import { ArticlePage } from "@/components/ArticlePage";

export async function generateStaticParams() {
  return PRESS_RELEASES.map((release) => ({
    id: release.id,
  }));
}

export default async function PressReleaseDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const release = PRESS_RELEASES.find((r) => r.id === id) || PRESS_RELEASES[0];

  return <ArticlePage release={release} />;
}
