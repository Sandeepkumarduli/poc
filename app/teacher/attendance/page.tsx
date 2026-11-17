"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { STUDENTS, type AttendanceStatus } from "@/data/mock";
import { toast, useApp } from "@/lib/store";
import { useToday } from "@/lib/hooks";
import { cn, fmtDate, lastSchoolDays } from "@/lib/utils";
import { Avatar, Button, Card, PageHeader, Pill, Reveal } from "@/components/ui";

const OPTIONS: { v: AttendanceStatus; label: string; on: string }[] = [
  { v: "P", label: "Present", on: "bg-ok text-white" },
  { v: "A", label: "Absent", on: "bg-bad text-white" },
  { v: "L", label: "Leave", on: "bg-warn text-white" },
];

export default function MarkAttendance() {
  const { iso, date } = useToday();
  const attendance = useApp((s) => s.attendance);
  const save = useApp((s) => s.saveAttendance);
  const dates = useMemo(() => lastSchoolDays(date, 6).reverse(), [date]);
  const [day, setDay] = useState(iso);

  const initial = (d: string) => Object.fromEntries(STUDENTS.map((s) => [s.id, attendance[d]?.[s.id] ?? "P"])) as Record<string, AttendanceStatus>;
  const [rows, setRows] = useState<Record<string, AttendanceStatus>>(() => initial(iso));
  const saved = !!attendance[day];
  const dirty = STUDENTS.some((s) => rows[s.id] !== (attendance[day]?.[s.id] ?? "P")) || !saved;

  const pick = (d: string) => {
    setDay(d);
    setRows(initial(d));
  };
  const count = (v: AttendanceStatus) => STUDENTS.filter((s) => rows[s.id] === v).length;

  const onSave = () => {
    save(day, rows);
    const absent = STUDENTS.filter((s) => rows[s.id] === "A").map((s) => s.name.split(" ")[0]);
    toast(`Attendance saved for ${fmtDate(day, { day: "numeric", month: "short" })}${absent.length ? ` · absent: ${absent.join(", ")}` : " · everyone present"}`);
  };

  return (
    <>
      <PageHeader
        title="Mark attendance"
        subtitle="Class 8-A · 10 students"
        action={saved ? <Pill tone="ok" dot>Saved for this day</Pill> : <Pill tone="warn" dot>Not saved yet</Pill>}
      />

      <Reveal i={1} className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
        {dates.map((d) => {
          const active = d === day;
          return (
            <button
              key={d}
              onClick={() => pick(d)}
              className={cn(
                "flex w-[68px] shrink-0 flex-col items-center rounded-2xl border py-2.5 transition-colors",
                active ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink-2 hover:bg-subtle",
              )}
            >
              <span className={cn("text-xs", active ? "text-white/70" : "text-ink-3")}>{fmtDate(d, { weekday: "short" })}</span>
              <span className="tabular text-lg font-semibold">{fmtDate(d, { day: "numeric" })}</span>
              <span className={cn("mt-0.5 size-1.5 rounded-full", attendance[d] ? (active ? "bg-accent" : "bg-ok") : "bg-transparent")} />
            </button>
          );
        })}
      </Reveal>

      <Card i={2}>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 text-sm">
            <Pill tone="ok">{count("P")} present</Pill>
            <Pill tone="bad">{count("A")} absent</Pill>
            <Pill tone="warn">{count("L")} leave</Pill>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" icon="check" onClick={() => setRows(Object.fromEntries(STUDENTS.map((s) => [s.id, "P"])) as Record<string, AttendanceStatus>)}>
              Mark all present
            </Button>
          </div>
        </div>

        <ul className="divide-y divide-line">
          {STUDENTS.map((s, i) => (
            <li key={s.id} className="rise flex flex-wrap items-center gap-3 py-3" style={{ "--i": i + 2 } as CSSProperties}>
              <span className="tabular w-8 text-sm text-ink-3">{String(s.roll).padStart(2, "0")}</span>
              <Avatar name={s.name} size={36} />
              <span className="min-w-[140px] flex-1">
                <span className="block text-sm font-medium">{s.name}</span>
                <span className="text-xs text-ink-3">Parent: {s.parent}</span>
              </span>
              <div className="inline-flex rounded-xl border border-line bg-subtle p-1" role="radiogroup" aria-label={`Attendance for ${s.name}`}>
                {OPTIONS.map((o) => (
                  <button
                    key={o.v}
                    role="radio"
                    aria-checked={rows[s.id] === o.v}
                    onClick={() => setRows((r) => ({ ...r, [s.id]: o.v }))}
                    className={cn("h-8 rounded-lg px-3 text-[13px] font-medium transition-colors", rows[s.id] === o.v ? o.on : "text-ink-2 hover:text-ink")}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          <span className="text-sm text-ink-3">{day === iso ? "Today" : fmtDate(day, { weekday: "long", day: "numeric", month: "long" })} · changes show up for students right away</span>
          <Button onClick={onSave} disabled={!dirty} icon="check">
            {saved && !dirty ? "Saved" : "Save attendance"}
          </Button>
        </div>
      </Card>
    </>
  );
}
