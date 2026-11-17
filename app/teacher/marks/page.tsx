"use client";

import { useState, type CSSProperties } from "react";
import { EXAMS, STUDENTS, SUBJECTS, type Subject } from "@/data/mock";
import { toast, useApp } from "@/lib/store";
import { grade } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import { Avatar, Button, Card, Field, PageHeader, Pill, StatCard } from "@/components/ui";

const selectCls = "h-11 w-full rounded-xl border border-line bg-subtle px-3 text-sm outline-none focus:border-accent focus:bg-white";

export default function EnterMarks() {
  const marks = useApp((s) => s.marks);
  const saveMarks = useApp((s) => s.saveMarks);
  const [examId, setExamId] = useState<"ut1" | "mid">("mid");
  const [subject, setSubject] = useState<Subject>("Maths");
  const exam = EXAMS.find((e) => e.id === examId)!;

  const load = (e: string, s: Subject) => Object.fromEntries(STUDENTS.map((st) => [st.id, String(marks[e]?.[st.id]?.[s] ?? "")]));
  const [rows, setRows] = useState<Record<string, string>>(() => load("mid", "Maths"));

  const change = (e: "ut1" | "mid", s: Subject) => {
    setExamId(e);
    setSubject(s);
    setRows(load(e, s));
  };

  const nums = STUDENTS.map((s) => Number(rows[s.id]));
  const invalid = STUDENTS.filter((s) => rows[s.id] === "" || isNaN(Number(rows[s.id])) || Number(rows[s.id]) < 0 || Number(rows[s.id]) > exam.max);
  const dirty = STUDENTS.some((s) => Number(rows[s.id]) !== marks[examId]?.[s.id]?.[subject]);
  const valid = nums.filter((n) => !isNaN(n));
  const avg = valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : 0;
  const top = Math.max(...valid);

  const onSave = () => {
    if (invalid.length) {
      toast(`Check marks for ${invalid.map((s) => s.name.split(" ")[0]).join(", ")} (0 to ${exam.max})`, "error");
      return;
    }
    saveMarks(examId, subject, Object.fromEntries(STUDENTS.map((s) => [s.id, Number(rows[s.id])])));
    toast(`${subject} marks saved for ${exam.name}`);
  };

  return (
    <>
      <PageHeader title="Enter marks" subtitle="Class 8-A · pick an exam and subject, edit, then save" />

      <Card i={1} className="mb-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <Field label="Exam">
            <select className={selectCls} value={examId} onChange={(e) => change(e.target.value as "ut1" | "mid", subject)}>
              {EXAMS.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name} (out of {e.max})
                </option>
              ))}
            </select>
          </Field>
          <Field label="Subject">
            <select className={selectCls} value={subject} onChange={(e) => change(examId, e.target.value as Subject)}>
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
          <Button onClick={onSave} disabled={!dirty} icon="check" className="w-full sm:w-auto">
            Save marks
          </Button>
        </div>
      </Card>

      <div key={examId + subject}>
        <div className="mb-4 grid grid-cols-3 gap-4">
          <StatCard i={2} label="Class average" value={`${(Math.round(avg * 10) / 10).toString()}`} note={`out of ${exam.max}`} />
          <StatCard i={3} label="Highest" value={isFinite(top) ? top : "–"} note={`out of ${exam.max}`} />
          <StatCard i={4} label="Below 40%" value={valid.filter((n) => n < exam.max * 0.4).length} note="students" />
        </div>

        <Card i={5}>
          <ul className="divide-y divide-line">
            {STUDENTS.map((s, i) => {
              const v = rows[s.id];
              const n = Number(v);
              const bad = invalid.includes(s);
              const pct = Math.round((n / exam.max) * 100);
              return (
                <li key={s.id} className="rise flex items-center gap-3 py-3" style={{ "--i": i + 4 } as CSSProperties}>
                  <span className="tabular w-8 text-sm text-ink-3">{String(s.roll).padStart(2, "0")}</span>
                  <Avatar name={s.name} size={34} />
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{s.name}</span>
                  {!bad && <Pill tone={pct >= 81 ? "ok" : pct >= 61 ? "indigo" : "warn"} className="hidden sm:inline-flex">{grade(pct)}</Pill>}
                  <div className="flex items-center gap-2">
                    <input
                      inputMode="numeric"
                      value={v}
                      onChange={(e) => setRows((r) => ({ ...r, [s.id]: e.target.value.replace(/[^0-9]/g, "").slice(0, 3) }))}
                      className={cn(
                        "tabular h-10 w-20 rounded-xl border bg-subtle px-3 text-right text-sm font-semibold outline-none transition-[border-color,background-color] focus:bg-white",
                        bad ? "border-bad text-bad" : "border-line focus:border-accent",
                      )}
                      aria-label={`${s.name} marks`}
                    />
                    <span className="tabular w-10 text-sm text-ink-3">/ {exam.max}</span>
                  </div>
                </li>
              );
            })}
          </ul>
          {invalid.length > 0 && <p className="mt-3 text-sm text-bad">Marks must be between 0 and {exam.max}.</p>}
        </Card>
      </div>
    </>
  );
}
