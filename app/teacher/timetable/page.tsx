"use client";

import { TEACHER_TIMETABLE } from "@/data/mock";
import { useToday } from "@/lib/hooks";
import { DAYS } from "@/lib/utils";
import { Card, PageHeader, StatCard } from "@/components/ui";
import { TimetableGrid } from "@/components/TimetableGrid";

export default function TeacherTimetable() {
  const { day } = useToday();
  const all = DAYS.flatMap((d) => TEACHER_TIMETABLE[d]);
  const teaching = all.filter((s) => s.subject !== "Free");
  const by = (c: string) => teaching.filter((s) => s.classId === c).length;

  return (
    <>
      <PageHeader title="My timetable" subtitle="Mrs. Meera Rao · Maths" />
      <div className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard i={1} label="Periods a week" value={teaching.length} note={`${all.length - teaching.length} free periods`} />
        <StatCard i={2} label="Class 8-A" value={by("8-A")} note="periods" />
        <StatCard i={3} label="Class 8-B" value={by("8-B")} note="periods" />
        <StatCard i={4} label="Class 9-A" value={by("9-A")} note="periods" />
      </div>
      <Card i={5}>
        <TimetableGrid
          today={day}
          cell={(d, p) => {
            const s = TEACHER_TIMETABLE[d][p];
            return s.subject === "Free" ? { title: "Free", muted: true } : { title: s.subject, sub: `Class ${s.classId}` };
          }}
        />
      </Card>
    </>
  );
}
