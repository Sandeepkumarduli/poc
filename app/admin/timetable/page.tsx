"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CLASSES, timetableForClass } from "@/data/mock";
import { useToday } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Card, PageHeader, Reveal } from "@/components/ui";
import { TimetableGrid } from "@/components/TimetableGrid";

function Inner() {
  const params = useSearchParams();
  const initial = CLASSES.some((c) => c.id === params.get("class")) ? params.get("class")! : "8-A";
  const [cls, setCls] = useState(initial);
  const { day } = useToday();
  const tt = timetableForClass(cls);
  const info = CLASSES.find((c) => c.id === cls)!;

  return (
    <>
      <PageHeader title="Timetable" subtitle={`Class ${cls} · class teacher ${info.classTeacher} · Room ${info.room}`} />
      <Reveal i={1} className="no-scrollbar mb-4 flex gap-2 overflow-x-auto pb-1">
        {CLASSES.map((c) => (
          <button
            key={c.id}
            onClick={() => setCls(c.id)}
            className={cn("h-10 shrink-0 rounded-xl border px-4 text-sm font-medium transition-colors", c.id === cls ? "border-ink bg-ink text-white" : "border-line bg-surface text-ink-2 hover:bg-subtle")}
          >
            {c.id}
          </button>
        ))}
      </Reveal>
      <Card i={2} key={cls}>
        <TimetableGrid today={day} cell={(d, p) => ({ title: tt[d][p].subject, sub: tt[d][p].teacher })} />
      </Card>
    </>
  );
}

export default function AdminTimetable() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}
