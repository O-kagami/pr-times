"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

export interface CalendarEntry {
  key: string;
  /** "2026-08-03" 形式。サーバー側で組み立てて渡す（クライアントで時差がズレないように） */
  dateKey: string;
  companyName: string;
  title: string;
  image: string | null;
  href: string;
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

const toKey = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

/**
 * 近しい企業のリリースを日付ごとにまとめたカレンダー。
 * 「この日、あの会社が出していた」が一目で分かることを狙っている。
 */
export function PeerCalendar({
  entries,
  todayKey,
  scopeLabel,
}: {
  entries: CalendarEntry[];
  todayKey: string;
  scopeLabel: string;
}) {
  const byDate = useMemo(() => {
    const map = new Map<string, CalendarEntry[]>();
    entries.forEach((entry) => {
      const list = map.get(entry.dateKey) ?? [];
      list.push(entry);
      map.set(entry.dateKey, list);
    });
    return map;
  }, [entries]);

  const latestKey = entries[0]?.dateKey ?? todayKey;
  const [selectedKey, setSelectedKey] = useState(latestKey);
  const [cursor, setCursor] = useState(() => {
    const [year, month] = latestKey.split("-").map(Number);
    return { year, month: month - 1 };
  });

  const cells = useMemo(() => {
    const firstWeekday = new Date(cursor.year, cursor.month, 1).getDay();
    const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();

    return [
      ...Array.from({ length: firstWeekday }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [cursor]);

  const shiftMonth = (delta: number) => {
    const next = new Date(cursor.year, cursor.month + delta, 1);
    setCursor({ year: next.getFullYear(), month: next.getMonth() });
  };

  const selected = byDate.get(selectedKey) ?? [];
  const [selectedYear, selectedMonth, selectedDay] = selectedKey.split("-").map(Number);

  return (
    <section>
      <div className="mb-3">
        <h2 className="font-extrabold text-[#4a332b] text-lg">まわりの発信カレンダー</h2>
        <p className="mt-0.5 text-[#a98a76] text-[12px]">
          {scopeLabel}で、直近に出たリリースをまとめました。
        </p>
      </div>

      <div className="items-start gap-4 grid grid-cols-1 lg:grid-cols-12">
        <div className="bg-white p-4 sm:p-5 border border-[#f0e2d6] rounded-2xl lg:col-span-7">
          <div className="flex justify-between items-center mb-4">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              className="hover:bg-[#f7ece3] p-1.5 rounded-full text-[#a98a76] transition-colors"
              aria-label="前の月"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-[#4a332b] text-sm">
              {cursor.year}年{cursor.month + 1}月
            </span>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              className="hover:bg-[#f7ece3] p-1.5 rounded-full text-[#a98a76] transition-colors"
              aria-label="次の月"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="gap-1 grid grid-cols-7 mb-1 text-center text-[#c0a595] text-[10px]">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>

          <div className="gap-1 grid grid-cols-7">
            {cells.map((day, index) => {
              if (day === null) {
                return <span key={`empty-${index}`} />;
              }

              const key = toKey(cursor.year, cursor.month, day);
              const items = byDate.get(key) ?? [];
              const isSelected = key === selectedKey;
              const isToday = key === todayKey;
              const thumbnail = items.find((item) => item.image)?.image ?? null;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => items.length > 0 && setSelectedKey(key)}
                  disabled={items.length === 0}
                  className={`relative flex flex-col justify-between rounded-xl aspect-square overflow-hidden text-left transition-all ${
                    items.length > 0
                      ? "cursor-pointer hover:ring-2 hover:ring-[#f3c9b3]"
                      : "cursor-default"
                  } ${isSelected ? "ring-2 ring-[#e0714c]" : ""} ${
                    items.length > 0 ? "bg-[#fdece4]" : "bg-[#faf6f2]"
                  }`}
                >
                  {thumbnail && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnail}
                      alt=""
                      className="absolute inset-0 opacity-45 w-full h-full object-cover"
                      loading="lazy"
                    />
                  )}

                  <span
                    className={`z-10 relative px-1.5 pt-1 font-bold text-[11px] tabular-nums ${
                      items.length > 0 ? "text-[#4a332b]" : "text-[#d6bda9]"
                    } ${isToday ? "underline decoration-[#e0714c] decoration-2 underline-offset-2" : ""}`}
                  >
                    {day}
                  </span>

                  {items.length > 0 && (
                    <span className="z-10 relative bg-[#e0714c] mb-1 ml-1.5 px-1.5 py-0.5 rounded-full w-fit font-bold text-[9px] text-white">
                      {items.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 border border-[#f0e2d6] rounded-2xl lg:col-span-5">
          <h3 className="flex items-center gap-1.5 font-bold text-[#4a332b] text-[13px]">
            <CalendarDays className="w-4 h-4 text-[#e0714c]" />
            {selectedMonth}月{selectedDay}日
            {selectedYear !== cursor.year && `（${selectedYear}年）`}のリリース
          </h3>

          {selected.length === 0 ? (
            <p className="mt-3 text-[#a98a76] text-[12px]">
              この日は、近しい会社の発信がありませんでした。
            </p>
          ) : (
            <ul className="flex flex-col gap-2.5 mt-3 pr-1 max-h-[340px] overflow-y-auto">
              {selected.map((entry) => (
                <li key={entry.key}>
                  <Link
                    href={entry.href}
                    className="flex items-start gap-3 hover:bg-[#faf4ef] p-2 rounded-xl transition-colors"
                  >
                    <span className="bg-[#f7ece3] rounded-lg w-14 h-14 overflow-hidden shrink-0">
                      {entry.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={entry.image}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block font-bold text-[#b07f63] text-[11px] truncate">
                        {entry.companyName}
                      </span>
                      <span className="block mt-0.5 text-[#4a332b] text-[12px] leading-snug line-clamp-2">
                        {entry.title}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
