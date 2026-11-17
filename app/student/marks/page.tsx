"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useApp } from "@/lib/store";
import { useStudentId } from "@/lib/hooks";
import { grade, overallPct, studentMarksRows } from "@/lib/selectors";
import { EXAMS } from "@/data/mock";
import { Card, CardHeader, PageHeader, Pill, StatCard } from "@/components/ui";
import { DataTable } from "@/components/DataTable";
import { ChartTooltip } from "@/components/ChartTooltip";
import { cn } from "@/lib/utils";

const UT1 = "#E8643B";
const MID = "#4B56D2";

export default function StudentMarks() {
  const sid = useStudentId();
  const marks = useApp((s) => s.marks);
  const rows = studentMarksRows(marks, sid);
  const ut1 = overallPct(marks, sid, "ut1");
  const mid = overallPct(marks, sid, "mid");
  const best = [...rows].sort((a, b) => b.midPct - a.midPct)[0];
  const weakest = [...rows].sort((a, b) => a.midPct - b.midPct)[0];

  return (
    <>
      <PageHeader title="Marks" subtitle={`${EXAMS[0].name} (out of ${EXAMS[0].max}) and ${EXAMS[1].name} (out of ${EXAMS[1].max})`} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard i={1} label="Unit Test 1" value={`${ut1}%`} note={`Grade ${grade(ut1)}`} />
        <StatCard i={2} label="Mid Term" value={`${mid}%`} note={`${mid >= ut1 ? "+" : ""}${Math.round((mid - ut1) * 10) / 10} pts vs Unit Test 1`} noteTone={mid >= ut1 ? "up" : "down"} />
        <StatCard i={3} label="Strongest subject" value={best.subject} note={`${best.midPct}% in Mid Term`} />
        <StatCard i={4} label="Needs attention" value={weakest.subject} note={`${weakest.midPct}% in Mid Term`} noteTone="down" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_1fr]">
        <Card i={5}>
          <CardHeader title="Progress by subject" subtitle="Score as % of maximum marks" />
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rows} barGap={2} barCategoryGap="28%" margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="rgba(31,27,24,0.07)" />
                <XAxis dataKey="subject" tickLine={false} axisLine={false} tick={{ fill: "#8f8780", fontSize: 12 }} />
                <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tickLine={false} axisLine={false} tick={{ fill: "#8f8780", fontSize: 12 }} unit="%" />
                <Tooltip cursor={{ fill: "rgba(31,27,24,0.04)" }} content={<ChartTooltip format={(v) => `${v}%`} />} />
                <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: 13, color: "#5d5650", paddingTop: 8 }} />
                <Bar name="Unit Test 1" dataKey="ut1Pct" fill={UT1} radius={[4, 4, 0, 0]} maxBarSize={22} animationDuration={900} />
                <Bar name="Mid Term" dataKey="midPct" fill={MID} radius={[4, 4, 0, 0]} maxBarSize={22} animationDuration={900} animationBegin={150} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card i={6}>
          <CardHeader title="Subject-wise marks" />
          <DataTable
            rows={rows}
            rowKey={(r) => r.subject}
            columns={[
              { key: "s", header: "Subject", render: (r) => <span className="font-medium">{r.subject}</span> },
              { key: "u", header: "UT 1 / 50", align: "right", render: (r) => <span className="tabular">{r.ut1}</span> },
              { key: "m", header: "Mid / 100", align: "right", render: (r) => <span className="tabular">{r.mid}</span> },
              {
                key: "c",
                header: "Change",
                align: "right",
                render: (r) => {
                  const d = r.midPct - r.ut1Pct;
                  return <span className={cn("tabular text-[13px]", d >= 0 ? "text-ok" : "text-bad")}>{d >= 0 ? `+${d}` : d}%</span>;
                },
              },
              { key: "g", header: "Grade", align: "right", render: (r) => <Pill tone={r.midPct >= 81 ? "ok" : r.midPct >= 61 ? "indigo" : "warn"}>{grade(r.midPct)}</Pill> },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
