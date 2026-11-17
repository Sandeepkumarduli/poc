"use client";

import { ADMIN_STATS, DEFAULTERS, FEES_8A, STUDENTS } from "@/data/mock";
import { toast } from "@/lib/store";
import { fmtINR, fmtINRCompact } from "@/lib/utils";
import { Avatar, Bar, Button, Card, CardHeader, PageHeader, Pill, StatCard } from "@/components/ui";
import { DataTable } from "@/components/DataTable";

export default function Fees() {
  const pending = ADMIN_STATS.feesTotal - ADMIN_STATS.feesCollected;
  const pct = Math.round((ADMIN_STATS.feesCollected / ADMIN_STATS.feesTotal) * 1000) / 10;
  const defaulterTotal = DEFAULTERS.reduce((a, d) => a + d.pending, 0);
  const classRows = STUDENTS.map((s) => ({ ...s, ...FEES_8A[s.id], pending: FEES_8A[s.id].total - FEES_8A[s.id].paid }));

  return (
    <>
      <PageHeader
        title="Fees"
        subtitle="Session 2026–27 · annual fee ₹48,000 per student"
        action={
          <Button variant="outline" icon="send" onClick={() => toast(`Reminders sent to ${DEFAULTERS.length} parents`, "info")}>
            Remind all defaulters
          </Button>
        }
      />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard i={1} label="Total due this year" value={fmtINRCompact(ADMIN_STATS.feesTotal)} note="500 students" />
        <StatCard i={2} label="Collected" value={fmtINRCompact(ADMIN_STATS.feesCollected)} note={`${pct}% of total`} noteTone="up" />
        <StatCard i={3} label="Pending" value={fmtINRCompact(pending)} note={`${Math.round((100 - pct) * 10) / 10}% of total`} noteTone="down" />
        <StatCard i={4} label="Collected in November" value={fmtINRCompact(ADMIN_STATS.feesCollectedThisMonth)} note="so far this month" />
      </div>

      <Card i={5} className="mt-4">
        <div className="mb-3 flex items-center justify-between text-sm">
          <span className="font-medium">Collection progress</span>
          <span className="tabular text-ink-2">
            {fmtINRCompact(ADMIN_STATS.feesCollected)} of {fmtINRCompact(ADMIN_STATS.feesTotal)}
          </span>
        </div>
        <div className="h-3">
          <Bar value={pct} color="bg-indigo" track="bg-indigo-soft" />
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-1 gap-4 2xl:grid-cols-2">
        <Card i={6}>
          <CardHeader title="Defaulter list" subtitle={`${DEFAULTERS.length} students · ${fmtINR(defaulterTotal)} overdue`} />
          <DataTable
            rows={DEFAULTERS}
            rowKey={(r) => r.name}
            columns={[
              {
                key: "n",
                header: "Student",
                render: (r) => (
                  <span className="flex items-center gap-2.5">
                    <Avatar name={r.name} size={30} />
                    <span>
                      <span className="block font-medium">{r.name}</span>
                      <span className="text-xs text-ink-3">Class {r.classId}</span>
                    </span>
                  </span>
                ),
              },
              { key: "p", header: "Parent", render: (r) => <span className="text-[13px] text-ink-2">{r.parent}<br />{r.phone}</span> },
              { key: "a", header: "Pending", align: "right", render: (r) => <span className="tabular font-semibold">{fmtINR(r.pending)}</span> },
              { key: "o", header: "Overdue", align: "right", render: (r) => <Pill tone={r.overdueDays > 60 ? "bad" : "warn"}>{r.overdueDays} days</Pill> },
              {
                key: "r",
                header: "",
                align: "right",
                render: (r) => (
                  <Button size="sm" variant="ghost" icon="send" onClick={() => toast(`Reminder sent to ${r.parent}`, "info")}>
                    Remind
                  </Button>
                ),
              },
            ]}
          />
        </Card>

        <Card i={7}>
          <CardHeader title="Class 8-A fees" subtitle="Paid and pending per student" />
          <DataTable
            rows={classRows}
            rowKey={(r) => r.id}
            columns={[
              { key: "n", header: "Student", render: (r) => <span className="font-medium">{r.name}</span> },
              { key: "t", header: "Total", align: "right", render: (r) => <span className="tabular text-ink-2">{fmtINR(r.total)}</span> },
              { key: "p", header: "Paid", align: "right", render: (r) => <span className="tabular">{fmtINR(r.paid)}</span> },
              { key: "d", header: "Pending", align: "right", render: (r) => <span className={`tabular font-medium ${r.pending ? "text-bad" : "text-ok"}`}>{r.pending ? fmtINR(r.pending) : "Paid"}</span> },
            ]}
          />
        </Card>
      </div>
    </>
  );
}
