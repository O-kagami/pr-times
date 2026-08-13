import React from "react";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
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
  return (
    <section>
      <div className="mb-3">
        <h2 className="font-extrabold text-[#4a332b] text-lg">似ている会社の、最近</h2>
        <p className="mt-0.5 text-[#a98a76] text-[12px]">
          {scopeLabel}で発信している会社です。同じ悩みを持つ仲間の一手が見えます。
        </p>
      </div>

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
