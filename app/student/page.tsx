"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { CLASS_8A, PERIODS, REWARD_POINTS, STUDENTS, TIMETABLE_8A, UPCOMING_EXAMS, studentById } from "@/data/mock";
import { useApp } from "@/lib/store";
import { useStudentId, useToday } from "@/lib/hooks";
import { overallPct, studentAttendance } from "@/lib/selectors";
import { cn, daysFromToday, fmtDate } from "@/lib/utils";
import { Card, CardHeader, PageHeader, Pill, Reveal, Ring } from "@/components/ui";
import { Icon } from "@/components/Icon";
import { SUBJECT_TINT } from "@/components/TimetableGrid";

export default function StudentHome() {
  const sid = useStudentId();
  const { iso, day } = useToday();
  const attendance = useApp((s) => s.attendance);
  const marks = useApp((s) => s.marks);
  const homework = useApp((s) => s.homework);
  const notices = useApp((s) => s.notices);

  const att = studentAttendance(attendance, sid);
  const todayStatus = attendance[iso]?.[sid];
  const points = REWARD_POINTS[sid];
  const rank = Object.values(REWARD_POINTS).filter((p) => p > points).length + 1;
  const nextExam = UPCOMING_EXAMS.find((e) => daysFromToday(e.date) >= 0) ?? UPCOMING_EXAMS[UPCOMING_EXAMS.length - 1];
  const pending = homework.filter((h) => h.status === "Pending");
  const mid = overallPct(marks, sid, "mid");
  const ut1 = overallPct(marks, sid, "ut1");
  const slots = day ? TIMETABLE_8A[day] : [];
  const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
  const currentIdx = PERIODS.findIndex((p) => {
    const [a, b] = p.time.split("–").map((t) => {
      const [h, m] = t.trim().split(":").map(Number);
      return (h < 7 ? h + 12 : h) * 60 + m;
    });
    return nowMin >= a && nowMin < b;
  });

  return (
    <>
      <PageHeader
        title="Overview"
        subtitle={`${CLASS_8A.name} · Roll ${studentById(sid)?.roll} · Class teacher ${CLASS_8A.classTeacher}`}
        action={
          todayStatus ? (
            <Pill tone={todayStatus === "P" ? "ok" : todayStatus === "A" ? "bad" : "warn"} dot>
              Today: {todayStatus === "P" ? "Present" : todayStatus === "A" ? "Absent" : "On leave"}
            </Pill>
          ) : (
            <Pill tone="neutral" dot>
              Today&apos;s attendance not marked yet
            </Pill>
          )
        }
      />

      {/* Key figures */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Reveal i={1}>
          <Link href="/student/attendance" className="group flex h-full items-center gap-5 rounded-[var(--radius-card)] border border-line bg-surface p-5 transition-colors hover:border-ink/15">
            <Ring value={att.pct} size={92} stroke={9} color={att.pct >= 90 ? "var(--color-ok)" : "var(--color-warn)"} track="var(--color-subtle)">
              <span className="tabular text-lg font-semibold">{Math.round(att.pct)}%</span>
            </Ring>
            <div className="min-w-0">
              <div className="text-sm text-ink-2">Attendance</div>
              <div className="tabular mt-1 text-[13px] text-ink-3">
                {att.present} of {att.total} days present
              </div>
              <div className="mt-2 flex gap-2 text-xs">
                <span className="text-bad">{att.absent} absent</span>
                <span className="text-warn">{att.leave} leave</span>
              </div>
            </div>
            <Icon name="arrowUpRight" size={18} className="ml-auto self-start text-ink-3 transition-colors group-hover:text-ink" />
          </Link>
        </Reveal>

        <Reveal i={2}>
          <Link href="/student/rewards" className="group flex h-full flex-col justify-between rounded-[var(--radius-card)] bg-accent p-5 text-white transition-colors hover:bg-[#df5a31]">
            <div className="flex items-center justify-between text-sm text-white/85">
              Reward points
              <span className="grid size-9 place-items-center rounded-full bg-white/15">
                <Icon name="trophy" size={17} />
              </span>
            </div>
            <div className="mt-4">
              <div className="tabular text-[34px] font-semibold leading-none">{points.toLocaleString("en-IN")}</div>
              <div className="mt-2 text-[13px] text-white/85">
                Rank {rank} of {STUDENTS.length} in class
              </div>
            </div>
          </Link>
        </Reveal>

        <Reveal i={3}>
          <div className="flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-line bg-surface p-5">
            <div className="flex items-center justify-between text-sm text-ink-2">
              Next exam
              <span className="grid size-9 place-items-center rounded-full bg-subtle">
                <Icon name="calendar" size={17} />
              </span>
            </div>
            <div className="mt-4">
              <div className="text-[22px] font-semibold leading-tight">{fmtDate(nextExam.date, { day: "numeric", month: "long" })}</div>
              <div className="mt-1.5 text-[13px] text-ink-3">
                {nextExam.name} · {nextExam.subject} · in {daysFromToday(nextExam.date)} days
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal i={4}>
          <Link href="/student/homework" className="group flex h-full flex-col justify-between rounded-[var(--radius-card)] border border-line bg-surface p-5 transition-colors hover:border-ink/15">
            <div className="flex items-center justify-between text-sm text-ink-2">
              Pending homework
              <span className="grid size-9 place-items-center rounded-full bg-subtle">
                <Icon name="book" size={17} />
              </span>
            </div>
            <div className="mt-4">
              <div className="tabular text-[34px] font-semibold leading-none">{pending.length}</div>
              <div className="mt-2 truncate text-[13px] text-ink-3">{pending[0] ? `Next: ${pending[0].subject}, due ${fmtDate(pending[0].due)}` : "All caught up"}</div>
            </div>
          </Link>
        </Reveal>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.6fr_1fr]">
        {/* Today's timetable */}
        <Card i={5}>
          <CardHeader
            title="Today's timetable"
            subtitle={day ? `${day} · 7 periods` : "No school today"}
            action={
              <Link href="/student/timetable" className="text-sm font-medium text-accent-strong hover:underline">
                Full week
              </Link>
            }
          />
          <ol className="space-y-2">
            {slots.map((s, i) => (
              <li
                key={i}
                className={cn("rise flex items-center gap-4 rounded-2xl px-3 py-2.5", i === currentIdx ? "bg-ink text-white" : "bg-subtle")}
                style={{ "--i": i + 5 } as CSSProperties}
              >
                <span className={cn("tabular w-[92px] shrink-0 text-xs", i === currentIdx ? "text-white/70" : "text-ink-3")}>{PERIODS[i].time}</span>
                <span className={cn("rounded-lg px-2 py-1 text-xs font-semibold", SUBJECT_TINT[s.subject])}>{s.subject}</span>
                <span className={cn("min-w-0 flex-1 truncate text-sm", i === currentIdx ? "text-white/85" : "text-ink-2")}>{s.teacher}</span>
                {i === currentIdx && <span className="text-xs font-medium text-accent">Now</span>}
              </li>
            ))}
          </ol>
        </Card>

        <div className="grid gap-4">
          {/* Results snapshot */}
          <Card i={6}>
            <CardHeader title="Results" subtitle="Overall percentage" action={<Link href="/student/marks" className="text-sm font-medium text-accent-strong hover:underline">Details</Link>} />
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-subtle p-4">
                <div className="text-xs text-ink-3">Unit Test 1</div>
                <div className="tabular mt-1 text-2xl font-semibold">{ut1}%</div>
              </div>
              <div className="rounded-2xl bg-indigo-soft p-4">
                <div className="text-xs text-indigo">Mid Term</div>
                <div className="tabular mt-1 text-2xl font-semibold text-indigo">{mid}%</div>
              </div>
            </div>
            <p className={cn("mt-3 text-[13px]", mid >= ut1 ? "text-ok" : "text-bad")}>
              {mid >= ut1 ? "↑" : "↓"} {Math.abs(Math.round((mid - ut1) * 10) / 10)} points vs Unit Test 1
            </p>
          </Card>

          {/* Notices */}
          <Card i={7}>
            <CardHeader title="Notices" action={<Link href="/student/notices" className="text-sm font-medium text-accent-strong hover:underline">View all</Link>} />
            <ul className="space-y-3">
              {notices.slice(0, 3).map((n) => (
                <li key={n.id} className="flex gap-3">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{n.title}</div>
                    <div className="text-xs text-ink-3">
                      {fmtDate(n.date)} · {n.by}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
