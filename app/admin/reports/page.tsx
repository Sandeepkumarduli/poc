"use client";

import { useState } from "react";
import { CLASS_8A, EXAMS, SCHOOL, STUDENTS } from "@/data/mock";
import { toast, useApp } from "@/lib/store";
import { grade, overallPct, studentAttendance, studentMarksRows } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import { Avatar, Button, Card, CardHeader, PageHeader, Reveal } from "@/components/ui";
import { Icon, LogoMark } from "@/components/Icon";

export default function Reports() {
  const [sid, setSid] = useState("s01");
  const marks = useApp((s) => s.marks);
  const attendance = useApp((s) => s.attendance);
  const st = STUDENTS.find((s) => s.id === sid)!;
  const rows = studentMarksRows(marks, sid);
  const att = studentAttendance(attendance, sid);
  const mid = overallPct(marks, sid, "mid");
  const ut1 = overallPct(marks, sid, "ut1");

  const download = () => {
    const a = document.createElement("a");
    a.href = "/sample-report-card.pdf";
    a.download = "StudentKitPro-sample-report-card.pdf";
    a.click();
    toast("Sample report card downloaded");
  };

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Report cards for Class 8-A, built from the latest marks and attendance"
        action={
          <div className="no-print flex flex-wrap gap-2">
            <Button variant="outline" icon="printer" onClick={() => window.print()}>
              Print / save as PDF
            </Button>
            <Button icon="download" onClick={download}>
              Download report card
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[300px_1fr]">
        <Card i={1} className="no-print h-fit">
          <CardHeader title="Students" subtitle="Class 8-A" />
          <ul className="space-y-1">
            {STUDENTS.map((s) => (
              <li key={s.id}>
                <button onClick={() => setSid(s.id)} className={cn("flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors", s.id === sid ? "bg-ink text-white" : "hover:bg-subtle")}>
                  <Avatar name={s.name} size={30} />
                  <span className="flex-1 truncate text-sm font-medium">{s.name}</span>
                  <span className={cn("tabular text-xs", s.id === sid ? "text-white/70" : "text-ink-3")}>{Math.round(overallPct(marks, s.id, "mid"))}%</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        {/* Report card preview — this is what prints */}
        <Reveal i={2} key={sid}>
          <div className="print-area rounded-[var(--radius-card)] border border-line bg-surface p-6 sm:p-10">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
              <div className="flex items-center gap-3">
                <LogoMark size={48} />
                <div>
                  <div className="text-lg font-semibold">{SCHOOL.name}</div>
                  <div className="text-sm text-ink-3">
                    {SCHOOL.city} · Session {SCHOOL.session}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">Progress report</div>
                <div className="text-xs text-ink-3">Term 1 · {EXAMS.map((e) => e.name).join(" & ")}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-line py-6 text-sm sm:grid-cols-4">
              <Info label="Student" value={st.name} />
              <Info label="Class" value={`${CLASS_8A.id} · Roll ${st.roll}`} />
              <Info label="Parent" value={st.parent} />
              <Info label="Class teacher" value={CLASS_8A.classTeacher} />
            </div>

            <table className="mt-6 w-full text-sm">
              <thead>
                <tr className="border-b border-line text-left text-[13px] text-ink-3">
                  <th className="pb-2 font-medium">Subject</th>
                  <th className="pb-2 text-right font-medium">Unit Test 1 (50)</th>
                  <th className="pb-2 text-right font-medium">Mid Term (100)</th>
                  <th className="pb-2 text-right font-medium">Grade</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.subject} className="border-b border-line">
                    <td className="py-2.5 font-medium">{r.subject}</td>
                    <td className="tabular py-2.5 text-right">{r.ut1}</td>
                    <td className="tabular py-2.5 text-right">{r.mid}</td>
                    <td className="py-2.5 text-right font-semibold">{grade(r.midPct)}</td>
                  </tr>
                ))}
                <tr>
                  <td className="pt-3 font-semibold">Overall</td>
                  <td className="tabular pt-3 text-right font-semibold">{ut1}%</td>
                  <td className="tabular pt-3 text-right font-semibold">{mid}%</td>
                  <td className="pt-3 text-right font-semibold">{grade(mid)}</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-subtle p-4">
                <div className="text-xs text-ink-3">Attendance</div>
                <div className="tabular mt-1 text-xl font-semibold">{att.pct}%</div>
                <div className="tabular text-xs text-ink-3">
                  {att.present} / {att.total} days
                </div>
              </div>
              <div className="rounded-2xl bg-subtle p-4 sm:col-span-2">
                <div className="text-xs text-ink-3">Class teacher&apos;s remark</div>
                <p className="mt-1 text-sm">
                  {mid >= 85
                    ? `${st.name.split(" ")[0]} is a consistent, hard-working student. Keep aiming high.`
                    : mid >= 70
                      ? `${st.name.split(" ")[0]} is doing well. More regular practice in ${[...rows].sort((a, b) => a.midPct - b.midPct)[0].subject} will lift the overall result.`
                      : `${st.name.split(" ")[0]} needs steady daily revision. Please meet the class teacher at the PTM.`}
                </p>
              </div>
            </div>

            <div className="mt-10 flex justify-between text-xs text-ink-3">
              <span>Class teacher</span>
              <span>Principal · Mr. Rajesh Kumar</span>
            </div>
          </div>
          <p className="no-print mt-3 flex items-center gap-2 text-xs text-ink-3">
            <Icon name="info" size={14} />
            “Download report card” gives a pre-made sample PDF. “Print / save as PDF” prints this live card.
          </p>
        </Reveal>
      </div>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-ink-3">{label}</div>
      <div className="mt-0.5 font-medium">{value}</div>
    </div>
  );
}
