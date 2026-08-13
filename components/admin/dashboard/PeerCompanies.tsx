import React from "react";
import Link from "next/link";
import { Lightbulb, MapPin, Tags, Users } from "lucide-react";
import type { PeerCompany } from "@/lib/adminDashboardRepository";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("ja-JP", { month: "long", day: "numeric" }).format(date);

/**
 * 似た企業（同じ業種・同じ都道府県）のサジェスト。
 * 「同じような立場の人が、こんな発信をしている」と分かるように、
 * 直近のリリースの写真をそのままカードのビジュアルにしている。
 */
export function PeerCompanies({
  peers,
  scopeLabel,
}: {
  peers: PeerCompany[];
  scopeLabel: string;
}) {
  const topicCounts = new Map<string, number>();
  peers.forEach((peer) => {
    peer.topics.forEach((topic) => {
      topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
    });
  });
  const frequentTopics = [...topicCounts.entries()]
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "ja"))
    .slice(0, 3)
    .map(([topic]) => topic);

  return (
    <section>
      <div className="mb-3">
        <h2 className="font-extrabold text-[#4a332b] text-lg">似ている会社の、最近</h2>
        <p className="mt-0.5 text-[#a98a76] text-[12px]">
          {scopeLabel}から、発信テーマや企業規模も近い会社を選びました。
        </p>
      </div>

      {frequentTopics.length > 0 && (
        <div className="flex items-start gap-3 bg-[#fff8ef] mb-4 px-4 py-3 border border-[#f2ddc7] rounded-2xl">
          <span className="flex justify-center items-center bg-white rounded-full w-8 h-8 text-[#e0714c] shrink-0">
            <Lightbulb className="w-4 h-4" aria-hidden="true" />
          </span>
          <div>
            <p className="font-bold text-[#4a332b] text-[12px]">発信のヒント</p>
            <p className="mt-0.5 text-[#7a5c4d] text-[12px] leading-relaxed">
              似た会社では
              {frequentTopics.map((topic, index) => (
                <React.Fragment key={topic}>
                  {index > 0 && "、"}
                  <span className="font-bold">「{topic}」</span>
                </React.Fragment>
              ))}
              がよく発信されています。
            </p>
          </div>
        </div>
      )}

      {peers.length === 0 ? (
        <div className="bg-white p-10 border border-[#f0e2d6] border-dashed rounded-2xl text-center">
          <p className="text-[#a98a76] text-[13px]">
            近しい会社の最近の発信が見つかりませんでした。
          </p>
        </div>
      ) : (
        <div className="gap-4 grid grid-cols-2 lg:grid-cols-4">
          {peers.map((peer) => (
            <Link
              key={peer.companyId}
              href={`/companies/${peer.companyId}`}
              className="group flex flex-col bg-white hover:shadow-[0_8px_24px_rgba(190,140,100,0.14)] border border-[#f0e2d6] rounded-2xl overflow-hidden transition-all duration-200"
            >
              <div className="bg-[#f7ece3] aspect-[4/3] overflow-hidden">
                {peer.latestImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={peer.latestImage}
                    alt={peer.latestTitle}
                    className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex justify-center items-center w-full h-full text-[#d6bda9]">
                    <Users className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 p-3.5">
                <h3 className="font-bold text-[#4a332b] text-[13px] leading-snug line-clamp-2">
                  {peer.companyName}
                </h3>

                {peer.prefecture && (
                  <span className="flex items-center gap-1 mt-1 text-[#a98a76] text-[11px]">
                    <MapPin className="w-3 h-3" />
                    {peer.prefecture}
                  </span>
                )}

                <div className="flex flex-wrap gap-1 mt-2">
                  {peer.similarityReasons.map((reason) => (
                    <span
                      key={reason}
                      className="bg-[#fff4ec] px-2 py-1 rounded-full text-[#9b674e] text-[10px] leading-none"
                    >
                      {reason}
                    </span>
                  ))}
                </div>

                {peer.topics.length > 0 && (
                  <p className="flex items-start gap-1 mt-2 text-[#a06f59] text-[10px] leading-relaxed">
                    <Tags className="mt-0.5 w-3 h-3 shrink-0" aria-hidden="true" />
                    <span>よく発信：{peer.topics.join("・")}</span>
                  </p>
                )}

                <p className="mt-2 text-[#7a5c4d] text-[11px] leading-relaxed line-clamp-2">
                  {peer.latestTitle}
                </p>

                <span className="mt-auto pt-2 text-[#b79c8c] text-[10px]">
                  {formatDate(peer.latestAt)}に発信
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
