import type { CSSProperties } from "react";
import { PERIODS } from "@/data/mock";
import { DAYS, cn, type Day } from "@/lib/utils";

export interface GridCell {
  title: string;
  sub?: string;
  muted?: boolean;
}

export const SUBJECT_TINT: Record<string, string> = {
  Maths: "bg-accent-soft text-accent-strong",
  Science: "bg-teal-soft text-teal",
  English: "bg-indigo-soft text-indigo",
  Hindi: "bg-violet-soft text-violet",
  Social: "bg-pink-soft text-pink",
  Computer: "bg-warn-soft text-warn",
};

/** Weekly grid: days down the side, 7 periods across. Today's row is highlighted. */
export function TimetableGrid({ cell, today }: { cell: (day: Day, period: number) => GridCell; today?: Day | null }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5 pb-1 sm:-mx-6 sm:px-6">
      <div className="grid min-w-[860px] grid-cols-[96px_repeat(7,minmax(0,1fr))] gap-2">
        <div />
        {PERIODS.map((p) => (
          <div key={p.n} className="px-1 pb-1 text-xs text-ink-3">
            <div className="font-medium text-ink-2">Period {p.n}</div>
            <div className="tabular">{p.time}</div>
          </div>
        ))}
        {DAYS.map((d, di) => (
          <Row key={d} day={d} di={di} cell={cell} isToday={today === d} />
        ))}
      </div>
    </div>
  );
}

function Row({ day, di, cell, isToday }: { day: Day; di: number; cell: (day: Day, period: number) => GridCell; isToday: boolean }) {
  return (
    <>
      <div className={cn("flex items-center rounded-xl px-3 text-sm font-medium", isToday ? "bg-ink text-white" : "text-ink-2")}>
        {day.slice(0, 3)}
        {isToday && <span className="ml-auto text-[11px] font-normal text-white/70">Today</span>}
      </div>
      {PERIODS.map((p, pi) => {
        const c = cell(day, pi);
        return (
          <div
            key={p.n}
            className={cn(
              "pop-in min-h-[64px] rounded-xl px-3 py-2.5",
              c.muted ? "border border-dashed border-line text-ink-3" : SUBJECT_TINT[c.title] ?? "bg-subtle text-ink",
              isToday && !c.muted && "ring-1 ring-ink/10",
            )}
            style={{ "--i": di * 7 + pi } as CSSProperties}
          >
            <div className="text-[13px] font-semibold leading-tight">{c.title}</div>
            {c.sub && <div className="mt-1 truncate text-[11px] opacity-80">{c.sub}</div>}
          </div>
        );
      })}
    </>
  );
}
