"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { useStudentId, useToday } from "@/lib/hooks";
import { studentAttendance } from "@/lib/selectors";
import { fmtDate } from "@/lib/utils";
import type { AttendanceStatus } from "@/data/mock";
import { Calendar } from "@/components/Calendar";
import { Card, CardHeader, PageHeader, Pill, Ring, StatCard } from "@/components/ui";

export default function StudentAttendance() {
  const sid = useStudentId();
  const { iso, date } = useToday();
  const attendance = useApp((s) => s.attendance);
  const [month, setMonth] = useState(new Date(date.getFullYear(), date.getMonth(), 1));

  const stats = studentAttendance(attendance, sid);
  const statuses: Record<string, AttendanceStatus> = {};
  for (const [d, rows] of Object.entries(attendance)) if (rows[sid]) statuses[d] = rows[sid];
  const missed = Object.entries(statuses)
    .filter(([, v]) => v !== "P")
    .sort(([a], [b]) => b.localeCompare(a));

  return (
    <>
      <PageHeader title="Attendance" subtitle={`Last ${stats.total} school days · updated by your class teacher`} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard i={1} label="Attendance" value={`${stats.pct}%`} note={stats.pct >= 90 ? "Above the 90% target" : "Below the 90% target"} noteTone={stats.pct >= 90 ? "up" : "down"} />
        <StatCard i={2} label="Present" value={stats.present} note="days" />
        <StatCard i={3} label="Absent" value={stats.absent} note="days" />
        <StatCard i={4} label="Leave" value={stats.leave} note="approved days" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.7fr_1fr]">
        <Card i={5}>
          <Calendar month={month} onMonthChange={setMonth} statuses={statuses} today={iso} />
        </Card>
        <div className="grid content-start gap-4">
          <Card i={6} className="flex items-center gap-5">
            <Ring value={stats.pct} size={110} stroke={11} color={stats.pct >= 90 ? "var(--color-ok)" : "var(--color-warn)"} track="var(--color-subtle)">
              <div className="text-center">
                <div className="tabular text-xl font-semibold">{stats.pct}%</div>
                <div className="text-[11px] text-ink-3">this term</div>
              </div>
            </Ring>
            <p className="text-sm text-ink-2">
              Schools expect at least <span className="font-semibold text-ink">75%</span> attendance to sit the final exam. Class 8-A aims for <span className="font-semibold text-ink">90%</span>.
            </p>
          </Card>
          <Card i={7}>
            <CardHeader title="Days missed" subtitle={`${missed.length} in this period`} />
            <ul className="space-y-2">
              {missed.map(([d, v]) => (
                <li key={d} className="flex items-center justify-between rounded-xl bg-subtle px-3 py-2.5 text-sm">
                  <span>{fmtDate(d, { weekday: "short", day: "numeric", month: "short" })}</span>
                  <Pill tone={v === "A" ? "bad" : "warn"}>{v === "A" ? "Absent" : "Leave"}</Pill>
                </li>
              ))}
              {missed.length === 0 && <li className="text-sm text-ink-3">No days missed. Keep it up.</li>}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
