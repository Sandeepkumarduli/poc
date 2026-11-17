"use client";

import type { CSSProperties } from "react";
import { BADGES, POINT_HISTORY_AARAV, REWARD_POINTS, STUDENTS } from "@/data/mock";
import { useStudentId } from "@/lib/hooks";
import { cn, fmtDate } from "@/lib/utils";
import { Avatar, Bar, Card, CardHeader, PageHeader, Reveal } from "@/components/ui";
import { Icon } from "@/components/Icon";

const BADGE_TINT: Record<string, string> = {
  indigo: "bg-indigo-soft text-indigo",
  accent: "bg-accent-soft text-accent-strong",
  violet: "bg-violet-soft text-violet",
  pink: "bg-pink-soft text-pink",
  teal: "bg-teal-soft text-teal",
};

export default function Rewards() {
  const sid = useStudentId();
  const board = STUDENTS.map((s) => ({ ...s, points: REWARD_POINTS[s.id] })).sort((a, b) => b.points - a.points);
  const me = board.findIndex((s) => s.id === sid);
  const top = board[0].points;
  const mine = REWARD_POINTS[sid];
  const earned = BADGES.filter((b) => b.earnedBy.includes(sid)).length;

  return (
    <>
      <PageHeader title="Rewards" subtitle="Points for attendance, homework, results and helping others" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.1fr_1fr_1fr]">
        <Reveal i={1}>
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[var(--radius-card)] bg-rail p-6 text-white">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">Your points</span>
              <span className="grid size-10 place-items-center rounded-full bg-accent">
                <Icon name="trophy" size={19} />
              </span>
            </div>
            <div className="mt-6">
              <div className="tabular text-[48px] font-semibold leading-none">{mine.toLocaleString("en-IN")}</div>
              <div className="mt-2 text-sm text-white/70">
                Rank <span className="font-semibold text-white">{me + 1}</span> of {board.length} · {me > 0 ? `${board[me - 1].points - mine + 1} points to pass ${board[me - 1].name.split(" ")[0]}` : "Top of the class"}
              </div>
            </div>
          </div>
        </Reveal>
        <Card i={2} className="flex flex-col justify-between">
          <div className="text-sm text-ink-2">Badges earned</div>
          <div className="tabular mt-4 text-[40px] font-semibold leading-none">
            {earned}
            <span className="text-xl text-ink-3"> / {BADGES.length}</span>
          </div>
          <div className="mt-4">
            <Bar value={(earned / BADGES.length) * 100} color="bg-accent" />
          </div>
        </Card>
        <Card i={3} className="flex flex-col justify-between">
          <div className="text-sm text-ink-2">Earned this month</div>
          <div className="tabular mt-4 text-[40px] font-semibold leading-none text-ok">+{POINT_HISTORY_AARAV.filter((p) => p.date.startsWith("2026-11")).reduce((a, p) => a + p.points, 0)}</div>
          <div className="mt-3 text-[13px] text-ink-3">from {POINT_HISTORY_AARAV.filter((p) => p.date.startsWith("2026-11")).length} activities in November</div>
        </Card>
      </div>

      {/* Badges */}
      <Card i={4} className="mt-4">
        <CardHeader title="Badges" subtitle="Earn badges by reaching milestones" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {BADGES.map((b, i) => {
            const has = b.earnedBy.includes(sid);
            return (
              <div key={b.id} className={cn("pop-in rounded-2xl border p-4", has ? "border-line bg-surface" : "border-dashed border-line bg-subtle/60")} style={{ "--i": i * 3 } as CSSProperties}>
                <span className={cn("grid size-12 place-items-center rounded-2xl", has ? BADGE_TINT[b.tint] : "bg-subtle text-ink-3")}>
                  <Icon name={b.icon} size={22} />
                </span>
                <div className={cn("mt-3 text-sm font-semibold", !has && "text-ink-3")}>{b.name}</div>
                <div className="mt-0.5 text-xs leading-snug text-ink-3">{b.description}</div>
                <div className={cn("mt-2 text-xs font-medium", has ? "text-ok" : "text-ink-3")}>{has ? "Earned" : "Locked"}</div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1fr]">
        <Card i={5}>
          <CardHeader title="Class leaderboard" subtitle="Class 8-A" />
          <ol className="space-y-1.5">
            {board.map((s, i) => (
              <li
                key={s.id}
                className={cn("rise flex items-center gap-3 rounded-2xl px-3 py-2.5", s.id === sid ? "bg-accent-soft" : "hover:bg-subtle")}
                style={{ "--i": i + 4 } as CSSProperties}
              >
                <span className={cn("tabular w-6 text-center text-sm font-semibold", i < 3 ? "text-accent-strong" : "text-ink-3")}>{i + 1}</span>
                <Avatar name={s.name} size={34} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {s.name}
                    {s.id === sid && <span className="ml-1.5 text-xs text-accent-strong">You</span>}
                  </span>
                  <span className="mt-1.5 block max-w-[220px]">
                    <Bar value={(s.points / top) * 100} i={i} color={s.id === sid ? "bg-accent" : "bg-indigo"} track="bg-black/5" />
                  </span>
                </span>
                <span className="tabular text-sm font-semibold">{s.points.toLocaleString("en-IN")}</span>
              </li>
            ))}
          </ol>
        </Card>

        <Card i={6}>
          <CardHeader title="Point history" />
          <ul className="space-y-1">
            {POINT_HISTORY_AARAV.map((p, i) => (
              <li key={i} className="rise flex items-center gap-3 border-b border-line py-3 last:border-0" style={{ "--i": i + 6 } as CSSProperties}>
                <span className={cn("grid size-9 place-items-center rounded-full", p.points > 0 ? "bg-ok-soft text-ok" : "bg-bad-soft text-bad")}>
                  <Icon name={p.points > 0 ? "plus" : "x"} size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm">{p.reason}</span>
                  <span className="text-xs text-ink-3">{fmtDate(p.date, { day: "numeric", month: "long" })}</span>
                </span>
                <span className={cn("tabular text-sm font-semibold", p.points > 0 ? "text-ok" : "text-bad")}>
                  {p.points > 0 ? "+" : ""}
                  {p.points}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
