import React from "react";
import { notFound } from "next/navigation";
import { MilestoneHero } from "@/components/admin/dashboard/MilestoneHero";
import { MyReleases } from "@/components/admin/dashboard/MyReleases";
import { HistoryInvite } from "@/components/admin/dashboard/HistoryInvite";
import { PeerCompanies } from "@/components/admin/dashboard/PeerCompanies";
import {
  PeerCalendar,
  type CalendarEntry,
} from "@/components/admin/dashboard/PeerCalendar";
import { computeMilestones, formatSpan, getAdminCompany } from "@/lib/adminCompany";
import { listPeerCompanies, listPeerReleases } from "@/lib/adminDashboardRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAY_MS = 24 * 60 * 60 * 1000;
/** 似た企業のサジェストは1年以内に発信のあった会社から選ぶ */
const PEER_WINDOW_DAYS = 365;
/** カレンダーに載せる期間 */
const CALENDAR_WINDOW_DAYS = 60;

const toDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const company = await getAdminCompany(companyId);

  return {
    title: company ? `${company.name} - 広報ダッシュボード` : "広報ダッシュボード",
  };
}

export default async function CompanyAdminDashboard({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const company = await getAdminCompany(companyId);

  if (!company) {
    notFound();
  }

  const now = new Date();
  const milestones = computeMilestones(company.releases, now);
  const excludeCompanyId = /^\d+$/.test(companyId) ? Number(companyId) : null;

  const { scope, peers } = await listPeerCompanies({
    industryId: company.industryId,
    prefecture: company.prefecture,
    excludeCompanyId,
    since: new Date(now.getTime() - PEER_WINDOW_DAYS * DAY_MS),
    limit: 8,
  });

  // カレンダーは似た企業カードと同じ範囲（県内 or 全国）に合わせる
  const peerReleases = await listPeerReleases({
    industryId: company.industryId,
    prefecture: scope === "prefecture" ? company.prefecture : null,
    excludeCompanyId,
    since: new Date(now.getTime() - CALENDAR_WINDOW_DAYS * DAY_MS),
    limit: 80,
  });

  const calendarEntries: CalendarEntry[] = peerReleases.map((release) => ({
    key: `${release.companyId}-${release.releaseId}`,
    dateKey: toDateKey(release.createdAt),
    companyName: release.companyName,
    title: release.title,
    image: release.image,
    href: `/companies/${release.companyId}/releases/pr-${release.companyId}-${release.releaseId}`,
  }));

  const scopeLabel =
    scope === "prefecture" && company.prefecture
      ? `${company.prefecture}の${company.industryName}`
      : `全国の${company.industryName}`;

  return (
    <div className="flex flex-col gap-8 sm:gap-10">
      <MilestoneHero company={company} milestones={milestones} />

      <MyReleases releases={company.releases} />

      <HistoryInvite
        companyId={companyId}
        releases={company.releases}
        yearsLabel={formatSpan(milestones.daysSinceFirst)}
      />

      <PeerCompanies peers={peers} scopeLabel={scopeLabel} />

      <PeerCalendar
        entries={calendarEntries}
        todayKey={toDateKey(now)}
        scopeLabel={scopeLabel}
      />
    </div>
  );
}
