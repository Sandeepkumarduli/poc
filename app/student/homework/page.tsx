"use client";

import { useState } from "react";
import { toast, useApp } from "@/lib/store";
import { Button, PageHeader, Reveal, Segmented } from "@/components/ui";
import { HomeworkList } from "@/components/HomeworkList";

type Filter = "all" | "Pending" | "Submitted" | "Graded";

export default function StudentHomework() {
  const homework = useApp((s) => s.homework);
  const submit = useApp((s) => s.submitHomework);
  const [filter, setFilter] = useState<Filter>("all");
  const items = [...homework]
    .filter((h) => filter === "all" || h.status === filter)
    .sort((a, b) => (a.status === "Pending" ? 0 : 1) - (b.status === "Pending" ? 0 : 1) || a.due.localeCompare(b.due));
  const count = (s: Filter) => homework.filter((h) => s === "all" || h.status === s).length;

  return (
    <>
      <PageHeader title="Homework" subtitle={`${count("Pending")} pending · ${count("Submitted")} submitted · ${count("Graded")} graded`} />
      <Reveal i={1} className="mb-4">
        <Segmented<Filter>
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: `All ${count("all")}` },
            { value: "Pending", label: "Pending" },
            { value: "Submitted", label: "Submitted" },
            { value: "Graded", label: "Graded" },
          ]}
        />
      </Reveal>
      <HomeworkList
        key={filter}
        items={items}
        action={(h) =>
          h.status === "Pending" ? (
            <Button
              size="sm"
              variant="outline"
              icon="check"
              onClick={() => {
                submit(h.id);
                toast(`Marked "${h.title}" as submitted`);
              }}
            >
              Mark done
            </Button>
          ) : null
        }
      />
      {items.length === 0 && <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-3">Nothing here.</p>}
    </>
  );
}
