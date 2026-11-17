import {
  ADMIN_STATS,
  ATTENDANCE_TREND_BASE,
  EXAMS,
  STUDENTS,
  SUBJECTS,
  type Attendance,
  type Marks,
} from "@/data/mock";

export function studentAttendance(att: Attendance, sid: string) {
  let present = 0,
    absent = 0,
    leave = 0;
  for (const day of Object.values(att)) {
    const v = day[sid];
    if (v === "P") present++;
    else if (v === "A") absent++;
    else if (v === "L") leave++;
  }
  const total = present + absent + leave;
  return { present, absent, leave, total, pct: total ? Math.round((present / total) * 1000) / 10 : 0 };
}

export function dayAttendance(att: Attendance, date: string) {
  const day = att[date];
  if (!day) return null;
  const present = STUDENTS.filter((s) => day[s.id] === "P").length;
  return { present, total: STUDENTS.length, pct: Math.round((present / STUDENTS.length) * 1000) / 10 };
}

/** School-wide attendance today: 490 other students (fixed) + 8-A from the store. */
export function schoolAttendanceToday(att: Attendance, today: string) {
  const a = dayAttendance(att, today);
  const present = ADMIN_STATS.otherClassesPresentToday + (a?.present ?? 0);
  const total = ADMIN_STATS.otherClassesStudents + (a ? a.total : 0);
  return { pct: Math.round((present / total) * 1000) / 10, present, total, classMarked: !!a };
}

export function attendanceTrend(att: Attendance, today: string, labels: string[]) {
  const t = schoolAttendanceToday(att, today);
  const vals = [...ATTENDANCE_TREND_BASE, t.pct];
  return vals.map((v, i) => ({ day: labels[i] ?? "", pct: v }));
}

export function studentMarksRows(marks: Marks, sid: string) {
  return SUBJECTS.map((sub) => {
    const ut1 = marks.ut1?.[sid]?.[sub] ?? 0;
    const mid = marks.mid?.[sid]?.[sub] ?? 0;
    return {
      subject: sub,
      ut1,
      mid,
      ut1Pct: Math.round((ut1 / EXAMS[0].max) * 100),
      midPct: Math.round((mid / EXAMS[1].max) * 100),
    };
  });
}

export function overallPct(marks: Marks, sid: string, examId: "ut1" | "mid") {
  const max = EXAMS.find((e) => e.id === examId)!.max * SUBJECTS.length;
  const got = SUBJECTS.reduce((a, s) => a + (marks[examId]?.[sid]?.[s] ?? 0), 0);
  return Math.round((got / max) * 1000) / 10;
}

export function grade(pct: number) {
  if (pct >= 91) return "A1";
  if (pct >= 81) return "A2";
  if (pct >= 71) return "B1";
  if (pct >= 61) return "B2";
  if (pct >= 51) return "C1";
  if (pct >= 41) return "C2";
  return "D";
}
