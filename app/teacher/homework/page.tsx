"use client";

import { useState, type FormEvent } from "react";
import { STUDENTS, SUBJECTS, type Subject } from "@/data/mock";
import { toast, useApp } from "@/lib/store";
import { addDays, isoDate } from "@/lib/utils";
import { Button, Card, CardHeader, Field, PageHeader, inputCls } from "@/components/ui";
import { HomeworkList } from "@/components/HomeworkList";

export default function PostHomework() {
  const homework = useApp((s) => s.homework);
  const addHomework = useApp((s) => s.addHomework);
  const name = useApp((s) => s.session?.name ?? "Mrs. Meera Rao");
  const [subject, setSubject] = useState<Subject>("Maths");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [due, setDue] = useState(isoDate(addDays(new Date(), 3)));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast("Add a title for the homework", "error");
    addHomework({ subject, title: title.trim(), details: details.trim() || "See class notes.", due, by: name });
    toast(`Homework posted to Class 8-A`);
    setTitle("");
    setDetails("");
  };

  return (
    <>
      <PageHeader title="Post homework" subtitle="Class 8-A · students see it on their Homework page" />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_1fr]">
        <Card i={1} className="h-fit xl:sticky xl:top-6">
          <CardHeader title="New homework" />
          <form onSubmit={submit} className="space-y-4">
            <Field label="Subject">
              <select className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value as Subject)}>
                {SUBJECTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Title">
              <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Exercise 4.3, questions 1–10" />
            </Field>
            <Field label="Instructions" hint="Optional">
              <textarea className={`${inputCls} h-24 resize-none py-3`} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Show all working in your notebook" />
            </Field>
            <Field label="Due date">
              <input type="date" className={inputCls} value={due} min={isoDate(new Date())} onChange={(e) => setDue(e.target.value)} />
            </Field>
            <Button type="submit" className="w-full" icon="plus">
              Post homework
            </Button>
          </form>
        </Card>

        <div>
          <h2 className="rise mb-3 text-[17px] font-semibold">Class homework · {homework.length}</h2>
          <HomeworkList items={homework} showStatus={false} meta={(h) => `${h.submitted}/${STUDENTS.length} submitted`} />
        </div>
      </div>
    </>
  );
}
