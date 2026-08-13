"use client";
import React from "react";
import Link from "next/link";

type Item = { title: string; href: string };

export default function SidebarNav({ items }: { items: Item[] }) {
  return (
    <nav>
      <ul className="flex flex-col gap-1">
        {items.map((it) => (
          <li key={it.href}>
            <Link href={it.href} className="block px-3 py-2 text-sm rounded hover:bg-gray-100">
              {it.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
