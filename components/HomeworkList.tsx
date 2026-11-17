"use client";

import type { CSSProperties, ReactNode } from "react";
import type { Homework } from "@/data/mock";
import { cn, daysFromToday, fmtDate } from "@/lib/utils";
import { Pill } from "./ui";
import { SUBJECT_TINT } from "./TimetableGrid";

export function dueLabel(due: string) {
  const n = daysFromToday(due);
  if (n === 0) return "Due today";
  if (n === 1) return "Due tomorrow";
  if (n > 1) return `Due in ${n} days`;
  return `Was due ${fmtDate(due)}`;
}

const STATUS_TONE = { Pending: "warn", Submitted: "indigo", Graded: "ok" } as const;

/** Homework rows shared by the student and teacher views. */
export function HomeworkList({ items, action, showStatus = true, meta }: { items: Homework[]; action?: (h: Homework) => ReactNode; showStatus?: boolean; meta?: (h: Homework) => ReactNode }) {
  return (
    <ul className="space-y-3">
      {items.map((h, i) => {
        const overdue = h.status === "Pending" && daysFromToday(h.due) < 0;
        return (
          <li key={h.id} className="rise flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:gap-4" style={{ "--i": i + 1 } as CSSProperties}>
            <div className="flex shrink-0 flex-col items-center justify-center rounded-xl bg-subtle px-3 py-2 sm:w-[76px]">
              <span className="text-[11px] text-ink-3">{fmtDate(h.due, { month: "short" })}</span>
              <span className="tabular text-xl font-semibold leading-tight">{fmtDate(h.due, { day: "numeric" })}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className={cn("rounded-md px-2 py-0.5 text-[11px] font-semibold", SUBJECT_TINT[h.subject])}>{h.subject}</span>
                <span className={cn("text-xs", overdue ? "text-bad" : "text-ink-3")}>{dueLabel(h.due)}</span>
              </div>
              <div className="font-medium">{h.title}</div>
              <div className="mt-0.5 text-sm text-ink-2">{h.details}</div>
              <div className="mt-1 text-xs text-ink-3">
                {h.by} · set on {fmtDate(h.assignedOn)}
                {meta && <> · {meta(h)}</>}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {showStatus && <Pill tone={STATUS_TONE[h.status]} dot>{h.status}</Pill>}
              {action?.(h)}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
