"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { PERIODS, STUDENTS, TEACHER_TASKS, TEACHER_TIMETABLE } from "@/data/mock";
import { useApp } from "@/lib/store";
import { useToday } from "@/lib/hooks";
import { dayAttendance } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import { Avatar, Card, CardHeader, PageHeader, Pill, Reveal, Ring } from "@/components/ui";
import { Icon, type IconName } from "@/components/Icon";

const ACTIONS: { href: string; title: string; sub: string; icon: IconName; tint: string; chip: string }[] = [
  { href: "/teacher/attendance", title: "Mark attendance", sub: "Class 8-A, today", icon: "calendarCheck", tint: "bg-indigo-soft", chip: "bg-indigo text-white" },
  { href: "/teacher/marks", title: "Enter marks", sub: "Unit Test 1 or Mid Term", icon: "pencil", tint: "bg-violet-soft", chip: "bg-violet text-white" },
  { href: "/teacher/homework", title: "Post homework", sub: "Shared with the class", icon: "book", tint: "bg-pink-soft", chip: "bg-pink text-white" },
  { href: "/teacher/notices", title: "Post notice", sub: "Visible to students", icon: "megaphone", tint: "bg-accent-soft", chip: "bg-accent text-white" },
];

export default function TeacherHome() {
  const { iso, day } = useToday();
  const attendance = useApp((s) => s.attendance);
  const homework = useApp((s) => s.homework);
  const today = dayAttendance(attendance, iso);
  const classes = day ? TEACHER_TIMETABLE[day].map((s, i) => ({ ...s, period: PERIODS[i] })).filter((s) => s.subject !== "Free") : [];
  const absentees = today ? STUDENTS.filter((s) => attendance[iso][s.id] !== "P") : [];
  const myHomework = homework.filter((h) => h.by === "Mrs. Meera Rao");
  const tasks = [
    ...(today ? [] : [{ id: "att", title: "Mark today's attendance for 8-A", due: "Today", href: "/teacher/attendance" }]),
    ...myHomework.filter((h) => h.submitted < STUDENTS.length).slice(0, 1).map((h) => ({ id: h.id, title: `Collect "${h.title}" (${h.submitted}/${STUDENTS.length} in)`, due: "This week", href: "/teacher/homework" })),
    ...TEACHER_TASKS.map((t) => ({ ...t, href: "" })),
  ];

  return (
    <>
      <PageHeader title="Overview" subtitle="Class teacher, 8-A · Maths for 8-A, 8-B and 9-A" />

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {ACTIONS.map((a, i) => (
          <Reveal key={a.href} i={i + 1}>
            <Link href={a.href} className={cn("group relative block h-full overflow-hidden rounded-[var(--radius-card)] border border-line p-4 transition-colors hover:border-ink/15 sm:p-5", a.tint)}>
              <span className={cn("grid size-10 place-items-center rounded-xl", a.chip)}>
                <Icon name={a.icon} size={19} />
              </span>
              <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/70 text-ink-2 transition-[transform,color] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink">
                <Icon name="arrowUpRight" size={16} />
              </span>
              <div className="mt-6 text-[15px] font-semibold">{a.title}</div>
              <div className="text-[13px] text-ink-2">{a.sub}</div>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1.35fr_1fr]">
        {/* Attendance today */}
        <Card i={5}>
          <CardHeader title="Class attendance today" subtitle="Class 8-A" />
          {today ? (
            <>
              <div className="flex items-center gap-5">
                <Ring value={today.pct} size={104} stroke={10} color="var(--color-ok)" track="var(--color-subtle)">
                  <span className="tabular text-xl font-semibold">{Math.round(today.pct)}%</span>
                </Ring>
                <div className="text-sm">
                  <div className="tabular text-2xl font-semibold">
                    {today.present}
                    <span className="text-base text-ink-3"> / {today.total}</span>
                  </div>
                  <div className="text-ink-3">students present</div>
                </div>
              </div>
              <div className="mt-5 text-xs text-ink-3">Not present today</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {absentees.length === 0 && <span className="text-sm text-ok">Full class present</span>}
                {absentees.map((s) => (
                  <Pill key={s.id} tone={attendance[iso][s.id] === "A" ? "bad" : "warn"}>
                    {s.name} · {attendance[iso][s.id] === "A" ? "Absent" : "Leave"}
                  </Pill>
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-line p-5 text-center">
              <div className="text-sm text-ink-2">Today&apos;s attendance is not marked yet</div>
              <Link href="/teacher/attendance" className="mt-3 inline-flex h-10 items-center gap-2 rounded-xl bg-ink px-4 text-sm font-medium text-white hover:bg-[#35302b]">
                Mark now <Icon name="arrowRight" size={15} />
              </Link>
            </div>
          )}
        </Card>

        {/* Today's classes */}
        <Card i={6}>
          <CardHeader title="Today's classes" subtitle={day ? `${day} · ${classes.length} periods` : "No classes today"} action={<Link href="/teacher/timetable" className="text-sm font-medium text-accent-strong hover:underline">Week</Link>} />
          <ol className="relative space-y-2.5 before:absolute before:bottom-3 before:left-[7px] before:top-3 before:w-px before:bg-line">
            {classes.map((c, i) => (
              <li key={i} className="rise relative flex items-center gap-4 pl-6" style={{ "--i": i + 6 } as CSSProperties}>
                <span className={cn("absolute left-0 size-[15px] rounded-full border-[3px] border-surface", c.classId === "8-A" ? "bg-accent" : "bg-indigo")} />
                <div className="flex flex-1 items-center gap-3 rounded-2xl bg-subtle px-4 py-3">
                  <div className="flex-1">
                    <div className="text-sm font-semibold">
                      {c.subject} · Class {c.classId}
                    </div>
                    <div className="tabular text-xs text-ink-3">
                      Period {c.period.n} · {c.period.time}
                    </div>
                  </div>
                  {c.classId === "8-A" && <Pill tone="accent">Your class</Pill>}
                </div>
              </li>
            ))}
          </ol>
        </Card>

        {/* Tasks */}
        <Card i={7}>
          <CardHeader title="Pending tasks" subtitle={`${tasks.length} open`} />
          <ul className="space-y-2">
            {tasks.map((t, i) => {
              const inner = (
                <>
                  <span className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border", t.id === "att" ? "border-accent" : "border-ink/20")} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm">{t.title}</span>
                    <span className={cn("text-xs", t.due === "Today" ? "text-accent-strong" : "text-ink-3")}>{t.due}</span>
                  </span>
                  {t.href && <Icon name="arrowRight" size={15} className="mt-1 text-ink-3" />}
                </>
              );
              return (
                <li key={t.id} className="rise" style={{ "--i": i + 7 } as CSSProperties}>
                  {t.href ? (
                    <Link href={t.href} className={cn("flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-subtle", t.id === "att" && "bg-accent-soft hover:bg-accent-soft")}>
                      {inner}
                    </Link>
                  ) : (
                    <div className="flex items-start gap-3 rounded-xl p-2.5">{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <Card i={8} className="mt-4">
        <CardHeader title="Class 8-A" subtitle={`${STUDENTS.length} students`} />
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-1">
          {STUDENTS.map((s, i) => (
            <div key={s.id} className="pop-in flex w-[112px] shrink-0 flex-col items-center rounded-2xl bg-subtle px-2 py-4 text-center" style={{ "--i": i * 2 } as CSSProperties}>
              <Avatar name={s.name} size={44} />
              <div className="mt-2 w-full truncate text-[13px] font-medium">{s.name}</div>
              <div className="text-xs text-ink-3">Roll {s.roll}</div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
