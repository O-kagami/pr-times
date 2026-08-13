import { PRESS_RELEASES } from "@/data/pressReleases";
import { ArticlePage } from "@/components/ArticlePage";

export async function generateStaticParams() {
  return PRESS_RELEASES.map((release) => ({
    companyId: release.companyId,
    releaseId: release.id,
  }));
}

export default async function PressReleaseDetail({
  params,
}: {
  params: Promise<{ companyId: string; releaseId: string }>;
}) {
  const { companyId, releaseId } = await params;
  const release =
    PRESS_RELEASES.find(
      (r) => r.id === releaseId && r.companyId === companyId
    ) || PRESS_RELEASES[0];

  return <ArticlePage release={release} />;
}
