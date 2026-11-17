"use client";

import Link from "next/link";
import { useMemo, type CSSProperties } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ADMIN_STATS, FEES_BY_MONTH, STUDENTS } from "@/data/mock";
import { useApp } from "@/lib/store";
import { useToday } from "@/lib/hooks";
import { attendanceTrend, overallPct, schoolAttendanceToday } from "@/lib/selectors";
import { fmtDate, fmtINRCompact, lastSchoolDays } from "@/lib/utils";
import { Avatar, Card, CardHeader, PageHeader, Pill, StatCard } from "@/components/ui";
import { ChartTooltip } from "@/components/ChartTooltip";
import { Icon } from "@/components/Icon";

const AXIS = { fill: "#8f8780", fontSize: 12 };

export default function AdminHome() {
  const { iso, date } = useToday();
  const attendance = useApp((s) => s.attendance);
  const marks = useApp((s) => s.marks);
  const notices = useApp((s) => s.notices);

  const today = schoolAttendanceToday(attendance, iso);
  const labels = useMemo(() => lastSchoolDays(date, 14).map((d) => fmtDate(d)), [date]);
  const trend = attendanceTrend(attendance, iso, labels);
  const prev = trend[trend.length - 2].pct;
  const topStudents = STUDENTS.map((s) => ({ ...s, pct: overallPct(marks, s.id, "mid") }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 5);
  const collectedPct = Math.round((ADMIN_STATS.feesCollected / ADMIN_STATS.feesTotal) * 1000) / 10;

  return (
    <>
      <PageHeader title="School overview" subtitle="Greenfield Public School · session 2026–27" />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <div className="min-w-0 space-y-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard i={1} label="Total students" value={ADMIN_STATS.totalStudents} note="+18 since June" noteTone="up" icon="users" href="/admin/classes" />
            <StatCard i={2} label="Teachers" value={ADMIN_STATS.totalTeachers} note="+2 since June" noteTone="up" icon="book" />
            <StatCard
              i={3}
              label="Attendance today"
              value={`${today.pct}%`}
              note={today.classMarked ? `${today.present} of ${today.total} present` : `8-A not marked yet · ${today.total} counted`}
              noteTone="muted"
              icon="calendarCheck"
            />
            <StatCard i={4} label="Fees this month" value={fmtINRCompact(ADMIN_STATS.feesCollectedThisMonth)} note={`${collectedPct}% of the year collected`} icon="wallet" href="/admin/fees" />
          </div>

          <Card i={5}>
            <CardHeader
              title="Attendance trend"
              subtitle="Whole school, last 14 school days"
              action={
                <div className="text-right">
                  <div className="tabular text-xl font-semibold">{today.pct}%</div>
                  <div className={`text-xs ${today.pct >= prev ? "text-ok" : "text-bad"}`}>
                    {today.pct >= prev ? "↑" : "↓"} {Math.abs(Math.round((today.pct - prev) * 10) / 10)} pts vs last school day
                  </div>
                </div>
              }
            />
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="attFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4B56D2" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#4B56D2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(31,27,24,0.07)" />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={AXIS} interval="preserveStartEnd" minTickGap={16} />
                  <YAxis domain={[88, 98]} ticks={[88, 90, 92, 94, 96, 98]} tickLine={false} axisLine={false} tick={AXIS} unit="%" />
                  <Tooltip cursor={{ stroke: "rgba(31,27,24,0.2)", strokeDasharray: "3 3" }} content={<ChartTooltip format={(v) => `${v}%`} />} />
                  <Area type="monotone" name="Attendance" dataKey="pct" stroke="#4B56D2" strokeWidth={2} fill="url(#attFill)" dot={false} activeDot={{ r: 5, strokeWidth: 2, stroke: "#fff" }} animationDuration={1100} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card i={6}>
            <CardHeader
              title="Fee collection"
              subtitle="By month, this session"
              action={
                <Link href="/admin/fees" className="text-sm font-medium text-accent-strong hover:underline">
                  Fee details
                </Link>
              }
            />
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FEES_BY_MONTH} margin={{ top: 8, right: 8, left: 6, bottom: 0 }} barCategoryGap="30%">
                  <defs>
                    <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                      <rect width="6" height="6" fill="#eceefd" />
                      <line x1="0" y1="0" x2="0" y2="6" stroke="#4B56D2" strokeWidth="2.2" />
                    </pattern>
                  </defs>
                  <CartesianGrid vertical={false} stroke="rgba(31,27,24,0.07)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={AXIS} />
                  <YAxis tickLine={false} axisLine={false} tick={AXIS} tickFormatter={(v) => `₹${v / 1e5}L`} width={52} />
                  <Tooltip cursor={{ fill: "rgba(31,27,24,0.04)" }} content={<ChartTooltip format={(v) => fmtINRCompact(v)} />} />
                  <Bar name="Collected" dataKey="collected" radius={[8, 8, 8, 8]} maxBarSize={56} animationDuration={900}>
                    {FEES_BY_MONTH.map((m, i) => (
                      <Cell key={m.month} fill={i === FEES_BY_MONTH.length - 1 ? "#4B56D2" : "url(#hatch)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-xs text-ink-3">November so far is shown solid. June and October are term-fee months.</p>
          </Card>
        </div>

        {/* Right rail, like the reference dashboard */}
        <div className="space-y-4">
          <Card i={3}>
            <CardHeader title="Fees collected" subtitle="Full year target" />
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="tabular text-2xl font-semibold">{fmtINRCompact(ADMIN_STATS.feesCollected)}</div>
                <div className="text-xs text-ink-3">of {fmtINRCompact(ADMIN_STATS.feesTotal)}</div>
              </div>
              <div className="relative size-[84px]">
                <svg viewBox="0 0 36 36" className="size-full -rotate-90">
                  <circle cx="18" cy="18" r="15.5" fill="none" stroke="#eceefd" strokeWidth="4" />
                  <circle className="ring-anim" cx="18" cy="18" r="15.5" fill="none" stroke="#4B56D2" strokeWidth="4" strokeLinecap="round" strokeDasharray={97.4} strokeDashoffset={97.4 * (1 - collectedPct / 100)} style={{ "--ring-full": 97.4 } as CSSProperties} />
                </svg>
                <span className="tabular absolute inset-0 grid place-items-center text-sm font-semibold">{Math.round(collectedPct)}%</span>
              </div>
            </div>
          </Card>

          <Card i={4}>
            <CardHeader title="Top students" subtitle="Class 8-A · Mid Term" action={<Link href="/admin/reports" className="text-sm font-medium text-accent-strong hover:underline">Reports</Link>} />
            <ul className="space-y-3">
              {topStudents.map((s, i) => (
                <li key={s.id} className="rise flex items-center gap-3" style={{ "--i": i + 5 } as CSSProperties}>
                  <Avatar name={s.name} size={36} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{s.name}</span>
                    <span className="text-xs text-ink-3">Roll {s.roll}</span>
                  </span>
                  <Pill tone="ok">{Math.round(s.pct)}%</Pill>
                </li>
              ))}
            </ul>
          </Card>

          <Card i={5}>
            <CardHeader title="Announcements" />
            <ul className="space-y-2.5">
              {notices.slice(0, 3).map((n, i) => {
                const tints = ["bg-violet-soft text-violet", "bg-teal-soft text-teal", "bg-warn-soft text-warn"];
                return (
                  <li key={n.id} className="flex items-center gap-3 rounded-2xl bg-subtle p-3">
                    <span className={`grid size-9 shrink-0 place-items-center rounded-full ${tints[i % 3]}`}>
                      <Icon name="megaphone" size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium">{n.title}</span>
                      <span className="text-xs text-ink-3">{fmtDate(n.date, { day: "numeric", month: "long" })}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
