"use client";

import type { CSSProperties } from "react";
import type { AttendanceStatus } from "@/data/mock";
import { cn, isoDate } from "@/lib/utils";
import { Icon } from "./Icon";

const STATUS_STYLE: Record<AttendanceStatus, string> = {
  P: "bg-ok-soft text-ok",
  A: "bg-bad-soft text-bad",
  L: "bg-warn-soft text-warn",
};
const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Month calendar with present / absent / leave colouring. */
export function Calendar({
  month,
  statuses,
  onMonthChange,
  today,
}: {
  month: Date;
  statuses: Record<string, AttendanceStatus>;
  onMonthChange: (d: Date) => void;
  today: string;
}) {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const lead = (first.getDay() + 6) % 7; // Monday-first
  const cells: (Date | null)[] = [...Array(lead).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))];

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{month.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</h3>
        <div className="flex gap-1.5">
          <button aria-label="Previous month" onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="grid size-9 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:bg-subtle">
            <Icon name="arrowRight" size={16} className="rotate-180" />
          </button>
          <button aria-label="Next month" onClick={() => onMonthChange(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="grid size-9 place-items-center rounded-full border border-line text-ink-2 transition-colors hover:bg-subtle">
            <Icon name="arrowRight" size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
        {WEEK.map((d) => (
          <div key={d} className="pb-1 text-center text-xs font-medium text-ink-3">
            {d}
          </div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const key = isoDate(d);
          const st = statuses[key];
          const sunday = d.getDay() === 0;
          const isToday = key === today;
          return (
            <div
              key={key}
              className={cn(
                "pop-in flex aspect-square flex-col items-center justify-center rounded-xl text-sm sm:rounded-2xl",
                st ? STATUS_STYLE[st] : sunday ? "bg-transparent text-ink-3/60" : "bg-subtle text-ink-3",
                isToday && "ring-2 ring-ink ring-offset-2 ring-offset-surface",
              )}
              style={{ "--i": i } as CSSProperties}
              title={st ? { P: "Present", A: "Absent", L: "Leave" }[st] : sunday ? "Sunday" : "No record"}
            >
              <span className="tabular font-semibold">{d.getDate()}</span>
            </div>
          );
        })}
      </div>
      <div className="mt-5 flex flex-wrap gap-4 text-[13px] text-ink-2">
        <Legend cls="bg-ok-soft border-ok/30" label="Present" />
        <Legend cls="bg-bad-soft border-bad/30" label="Absent" />
        <Legend cls="bg-warn-soft border-warn/30" label="Leave" />
        <Legend cls="bg-subtle border-line" label="Not marked" />
      </div>
    </div>
  );
}

function Legend({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={cn("size-3.5 rounded border", cls)} />
      {label}
    </span>
  );
}
