import React from "react";
import { Eye, Heart, Newspaper, Sparkles, Sunrise } from "lucide-react";
import type { AdminCompany, Milestones } from "@/lib/adminCompany";
import { describeReach } from "@/lib/adminCompany";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric" }).format(
    date
  );

/**
 * ダッシュボードの一番上。
 * PVは日々増減するものではなく「これまでの合計」＝減らない数字として見せて、
 * 続けてきたこと自体が積み上がっている感覚を出す。
 */
export function MilestoneHero({
  company,
  milestones,
}: {
  company: AdminCompany;
  milestones: Milestones;
}) {
  const stats = [
    {
      label: "累計PV",
      value: milestones.totalPageView.toLocaleString(),
      unit: "回読まれました",
      icon: Eye,
    },
    {
      label: "累計いいね",
      value: milestones.totalLikes.toLocaleString(),
      unit: "の反応が届きました",
      icon: Heart,
    },
    {
      label: "出したリリース",
      value: milestones.releaseCount.toLocaleString(),
      unit: "本ぶんの発信",
      icon: Newspaper,
    },
    {
      label: "発信をはじめて",
      value: milestones.daysSinceFirst.toLocaleString(),
      unit: "日目",
      icon: Sunrise,
    },
  ];

  return (
    <section className="bg-gradient-to-br from-[#fff3e9] via-[#fdece4] to-[#fbe3e6] p-6 sm:p-8 border border-[#f3ddcd] rounded-3xl">
      <p className="font-medium text-[#b07f63] text-xs">
        {new Intl.DateTimeFormat("ja-JP", {
          month: "long",
          day: "numeric",
          weekday: "long",
        }).format(new Date())}
      </p>

      <h1 className="mt-1.5 font-extrabold text-[#4a332b] text-xl sm:text-2xl leading-snug">
        おかえりなさい、{company.name}の広報さん
      </h1>

      <p className="mt-2 max-w-2xl text-[#7a5c4d] text-[13px] leading-relaxed">
        {milestones.firstReleaseAt
          ? `${formatDate(milestones.firstReleaseAt)}の1本目から、ここまで積み上げてきました。`
          : "ここが、これから積み上がっていく数字の置き場所です。"}
        いちど届いた数字は、減りません。
      </p>

      <div className="gap-3 grid grid-cols-2 lg:grid-cols-4 mt-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white/80 backdrop-blur-sm p-4 border border-white rounded-2xl"
            >
              <div className="flex items-center gap-1.5 text-[#b07f63] text-[11px]">
                <Icon className="w-3.5 h-3.5" />
                {stat.label}
              </div>
              <div className="mt-1.5 font-extrabold text-[#e0714c] text-2xl sm:text-3xl tabular-nums tracking-tight">
                {stat.value}
              </div>
              <div className="mt-0.5 text-[#a98a76] text-[11px]">{stat.unit}</div>
            </div>
          );
        })}
      </div>

      <p className="flex items-start gap-2 bg-white/70 mt-4 px-4 py-3 rounded-2xl text-[#7a5c4d] text-[12px] leading-relaxed">
        <Sparkles className="mt-0.5 w-4 h-4 text-[#e0a04c] shrink-0" />
        {describeReach(milestones.totalPageView)}
        {milestones.activeMonths > 0 &&
          `これまで${milestones.activeMonths}か月にわたって発信してきました。`}
      </p>
    </section>
  );
}
