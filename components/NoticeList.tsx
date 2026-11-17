"use client";

import type { CSSProperties } from "react";
import type { Notice } from "@/data/mock";
import { fmtDate } from "@/lib/utils";
import { Avatar, Pill, type Tone } from "./ui";

const TAG_TONE: Record<Notice["tag"], Tone> = { Event: "accent", Exam: "indigo", Holiday: "teal", General: "neutral", Class: "violet" };

export function NoticeList({ notices }: { notices: Notice[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {notices.map((n, i) => (
        <article key={n.id} className="rise flex flex-col rounded-[var(--radius-card)] border border-line bg-surface p-5" style={{ "--i": i + 1 } as CSSProperties}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <Pill tone={TAG_TONE[n.tag]}>{n.tag}</Pill>
            <span className="text-xs text-ink-3">{fmtDate(n.date, { weekday: "short", day: "numeric", month: "short" })}</span>
          </div>
          <h3 className="text-[17px] font-semibold leading-snug">{n.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-2">{n.body}</p>
          <div className="mt-4 flex items-center gap-2.5 border-t border-line pt-4 text-sm">
            <Avatar name={n.by} size={28} />
            <span className="text-ink-2">{n.by}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
