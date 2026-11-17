"use client";

import { useState, type FormEvent } from "react";
import type { Notice } from "@/data/mock";
import { toast, useApp } from "@/lib/store";
import { Button, Card, CardHeader, Field, PageHeader, inputCls } from "@/components/ui";
import { NoticeList } from "@/components/NoticeList";

const TAGS: Notice["tag"][] = ["Class", "Event", "Exam", "Holiday", "General"];

export default function PostNotice() {
  const notices = useApp((s) => s.notices);
  const addNotice = useApp((s) => s.addNotice);
  const name = useApp((s) => s.session?.name ?? "Mrs. Meera Rao");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tag, setTag] = useState<Notice["tag"]>("Class");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return toast("Add a title and a message", "error");
    addNotice({ title: title.trim(), body: body.trim(), tag, by: name });
    toast("Notice posted");
    setTitle("");
    setBody("");
  };

  return (
    <>
      <PageHeader title="Post notice" subtitle="Students see new notices at the top of their list" />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[380px_1fr]">
        <Card i={1} className="h-fit xl:sticky xl:top-6">
          <CardHeader title="New notice" />
          <form onSubmit={submit} className="space-y-4">
            <Field label="Title">
              <input className={inputCls} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Science exhibition on Friday" />
            </Field>
            <Field label="Message">
              <textarea className={`${inputCls} h-32 resize-none py-3`} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Details for students and parents" />
            </Field>
            <Field label="Category">
              <select className={inputCls} value={tag} onChange={(e) => setTag(e.target.value as Notice["tag"])}>
                {TAGS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Button type="submit" className="w-full" icon="megaphone">
              Post notice
            </Button>
          </form>
        </Card>
        <div>
          <h2 className="rise mb-3 text-[17px] font-semibold">Recent notices · {notices.length}</h2>
          <NoticeList notices={notices} />
        </div>
      </div>
    </>
  );
}
