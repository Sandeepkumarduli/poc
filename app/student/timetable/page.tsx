"use client";

import { TIMETABLE_8A } from "@/data/mock";
import { useToday } from "@/lib/hooks";
import { Card, PageHeader } from "@/components/ui";
import { TimetableGrid } from "@/components/TimetableGrid";

export default function StudentTimetable() {
  const { day } = useToday();
  return (
    <>
      <PageHeader title="Timetable" subtitle="Class 8-A · Monday to Saturday · break 10:15–10:35, lunch 12:05–12:45" />
      <Card i={1}>
        <TimetableGrid today={day} cell={(d, p) => ({ title: TIMETABLE_8A[d][p].subject, sub: TIMETABLE_8A[d][p].teacher })} />
      </Card>
    </>
  );
}
