"use client";

import Link from "next/link";
import { CLASSES, STUDENTS } from "@/data/mock";
import { useApp } from "@/lib/store";
import { useToday } from "@/lib/hooks";
import { dayAttendance } from "@/lib/selectors";
import { rng } from "@/lib/utils";
import { Avatar, Bar, Card, PageHeader, Pill, StatCard } from "@/components/ui";
import { DataTable } from "@/components/DataTable";

export default function Classes() {
  const { iso } = useToday();
  const attendance = useApp((s) => s.attendance);
  const live = dayAttendance(attendance, iso);
  const rows = CLASSES.map((c) => {
    const pct = c.id === "8-A" ? live?.pct ?? null : Math.round((91 + rng(c.id + iso)() * 7) * 10) / 10;
    return { ...c, pct };
  });
  const total = CLASSES.reduce((a, c) => a + c.students, 0);

  return (
    <>
      <PageHeader title="Classes" subtitle={`${CLASSES.length} sections · ${total} students`} />
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard i={1} label="Sections" value={CLASSES.length} note="Classes 6 to 12" />
        <StatCard i={2} label="Students" value={total} note={`avg ${Math.round(total / CLASSES.length)} per section`} />
        <StatCard i={3} label="Largest section" value="10-A · 11-A" note="47 students each" />
        <StatCard i={4} label="Demo section" value="8-A" note={`${STUDENTS.length} students with full data`} />
      </div>
      <Card i={5}>
        <DataTable
          rows={rows}
          rowKey={(r) => r.id}
          rowClassName={(r) => (r.id === "8-A" ? "bg-accent-soft/50" : "")}
          columns={[
            {
              key: "c",
              header: "Class",
              render: (r) => (
                <span className="flex items-center gap-2 font-semibold">
                  {r.id}
                  {r.id === "8-A" && <Pill tone="accent">Live data</Pill>}
                </span>
              ),
            },
            {
              key: "t",
              header: "Class teacher",
              render: (r) => (
                <span className="flex items-center gap-2.5">
                  <Avatar name={r.classTeacher} size={30} />
                  {r.classTeacher}
                </span>
              ),
            },
            { key: "r", header: "Room", render: (r) => <span className="text-ink-2">{r.room}</span> },
            { key: "s", header: "Students", align: "right", render: (r) => <span className="tabular font-medium">{r.students}</span> },
            {
              key: "a",
              header: "Attendance today",
              render: (r, i) =>
                r.pct == null ? (
                  <span className="text-[13px] text-ink-3">Not marked yet</span>
                ) : (
                  <span className="flex items-center gap-3">
                    <span className="w-24">
                      <Bar value={r.pct} i={i} color={r.pct >= 92 ? "bg-ok" : "bg-warn"} />
                    </span>
                    <span className="tabular text-[13px]">{r.pct}%</span>
                  </span>
                ),
            },
            {
              key: "l",
              header: "",
              align: "right",
              render: (r) => (
                <Link href={`/admin/timetable?class=${r.id}`} className="text-[13px] font-medium text-accent-strong hover:underline">
                  Timetable
                </Link>
              ),
            },
          ]}
        />
      </Card>
    </>
  );
}
