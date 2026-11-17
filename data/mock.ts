/**
 * StudentKitPro — all hardcoded demo data lives here.
 * Static data is exported directly. Data that teachers can change
 * (attendance, marks, homework, notices) is produced by createSeed()
 * and copied into the persisted store, so "Reset demo data" can restore it.
 */
import { addDays, isoDate, lastSchoolDays, rng, schoolToday, type Day } from "@/lib/utils";

/* ───────────── Users & roles ───────────── */

export type Role = "student" | "teacher" | "admin";

export interface User {
  email: string;
  password: string;
  name: string;
  role: Role;
  title: string; // shown under the name in the top bar
  studentId?: string;
  teacherId?: string;
}

export const DEMO_PASSWORD = "demo123";

export const USERS: User[] = [
  { email: "student@school.com", password: DEMO_PASSWORD, name: "Aarav Sharma", role: "student", title: "Class 8-A · Roll 12", studentId: "s01" },
  { email: "teacher@school.com", password: DEMO_PASSWORD, name: "Mrs. Meera Rao", role: "teacher", title: "Class teacher 8-A · Maths", teacherId: "t1" },
  { email: "admin@school.com", password: DEMO_PASSWORD, name: "Mr. Rajesh Kumar", role: "admin", title: "Principal" },
];

export const SCHOOL = { name: "Greenfield Public School", city: "Pune", session: "2026–27" };

/* ───────────── Class 8-A ───────────── */

export interface Student {
  id: string;
  name: string;
  roll: number;
  gender: "M" | "F";
  parent: string;
  phone: string;
}

export const CLASS_8A = { id: "8-A", name: "Class 8-A", classTeacher: "Mrs. Meera Rao", room: "Room 204" };

export const STUDENTS: Student[] = [
  { id: "s02", name: "Ananya Iyer", roll: 2, gender: "F", parent: "Lakshmi Iyer", phone: "98201 44512" },
  { id: "s05", name: "Arjun Reddy", roll: 4, gender: "M", parent: "Srinivas Reddy", phone: "99870 21345" },
  { id: "s08", name: "Ishita Banerjee", roll: 6, gender: "F", parent: "Sourav Banerjee", phone: "98300 67120" },
  { id: "s04", name: "Diya Patel", roll: 9, gender: "F", parent: "Hetal Patel", phone: "97250 88341" },
  { id: "s01", name: "Aarav Sharma", roll: 12, gender: "M", parent: "Vikram Sharma", phone: "98111 20934" },
  { id: "s07", name: "Kabir Mehta", roll: 15, gender: "M", parent: "Nisha Mehta", phone: "98922 30177" },
  { id: "s10", name: "Myra Joshi", roll: 17, gender: "F", parent: "Amit Joshi", phone: "90040 55219" },
  { id: "s09", name: "Rohan Kulkarni", roll: 19, gender: "M", parent: "Sunil Kulkarni", phone: "98500 41290" },
  { id: "s06", name: "Saanvi Nair", roll: 25, gender: "F", parent: "Deepa Nair", phone: "94470 13388" },
  { id: "s03", name: "Vihaan Gupta", roll: 28, gender: "M", parent: "Rakesh Gupta", phone: "98100 76243" },
];

export const studentById = (id: string) => STUDENTS.find((s) => s.id === id);

/* ───────────── Subjects & teachers ───────────── */

export const SUBJECTS = ["Maths", "Science", "English", "Hindi", "Social", "Computer"] as const;
export type Subject = (typeof SUBJECTS)[number];

export interface Teacher {
  id: string;
  name: string;
  subject: Subject;
  phone: string;
  classes: string[];
}

export const TEACHERS: Teacher[] = [
  { id: "t1", name: "Mrs. Meera Rao", subject: "Maths", phone: "98450 11223", classes: ["8-A", "8-B", "9-A"] },
  { id: "t2", name: "Mr. Anil Verma", subject: "Science", phone: "98860 22334", classes: ["8-A", "8-B", "7-A"] },
  { id: "t3", name: "Ms. Priya Nair", subject: "English", phone: "99000 33445", classes: ["8-A", "9-A", "9-B"] },
  { id: "t4", name: "Mr. Suresh Yadav", subject: "Hindi", phone: "97400 44556", classes: ["8-A", "7-A", "7-B"] },
  { id: "t5", name: "Mrs. Kavita Iyer", subject: "Social", phone: "98440 55667", classes: ["8-A", "8-B", "10-A"] },
  { id: "t6", name: "Mr. Rohan Das", subject: "Computer", phone: "99160 66778", classes: ["8-A", "9-A", "10-B"] },
];

export const teacherForSubject = (s: Subject) => TEACHERS.find((t) => t.subject === s)!;

/* ───────────── Timetable ───────────── */

export const PERIODS = [
  { n: 1, time: "8:00 – 8:45" },
  { n: 2, time: "8:45 – 9:30" },
  { n: 3, time: "9:30 – 10:15" },
  { n: 4, time: "10:35 – 11:20" },
  { n: 5, time: "11:20 – 12:05" },
  { n: 6, time: "12:45 – 1:30" },
  { n: 7, time: "1:30 – 2:15" },
];

export interface Slot {
  subject: Subject;
  teacher: string;
}

const GRID_8A: Record<Day, Subject[]> = {
  Monday: ["Maths", "English", "Science", "Hindi", "Social", "Computer", "Maths"],
  Tuesday: ["Science", "Maths", "English", "Social", "Hindi", "Maths", "Computer"],
  Wednesday: ["English", "Science", "Maths", "Computer", "Social", "Hindi", "Science"],
  Thursday: ["Maths", "Social", "Hindi", "English", "Science", "Computer", "English"],
  Friday: ["Hindi", "Maths", "Social", "Science", "English", "Maths", "Social"],
  Saturday: ["Science", "English", "Maths", "Social", "Hindi", "Computer", "Science"],
};

const toSlots = (g: Record<Day, Subject[]>) =>
  Object.fromEntries(
    Object.entries(g).map(([d, subs]) => [d, subs.map((s) => ({ subject: s, teacher: teacherForSubject(s).name }))]),
  ) as Record<Day, Slot[]>;

export const TIMETABLE_8A = toSlots(GRID_8A);

/** Other classes reuse the 8-A pattern, rotated, so every class has a full grid. */
export function timetableForClass(classId: string): Record<Day, Slot[]> {
  if (classId === "8-A") return TIMETABLE_8A;
  const shift = CLASSES.findIndex((c) => c.id === classId) + 1;
  const days = Object.keys(GRID_8A) as Day[];
  const g = {} as Record<Day, Subject[]>;
  days.forEach((d, i) => {
    const src = GRID_8A[days[(i + shift) % days.length]];
    g[d] = src.map((_, p) => src[(p + shift) % src.length]);
  });
  return toSlots(g);
}

export interface TeacherSlot {
  subject: Subject | "Free";
  classId: string | null;
}

/** Mrs. Meera Rao's week: every 8-A Maths period plus Maths in 8-B and 9-A. */
export const TEACHER_TIMETABLE: Record<Day, TeacherSlot[]> = (() => {
  const out = {} as Record<Day, TeacherSlot[]>;
  (Object.keys(GRID_8A) as Day[]).forEach((d, di) => {
    out[d] = GRID_8A[d].map((s, p) => {
      if (s === "Maths") return { subject: "Maths", classId: "8-A" };
      if ((di + p) % 3 === 0) return { subject: "Maths", classId: "8-B" };
      if ((di * 2 + p) % 5 === 1) return { subject: "Maths", classId: "9-A" };
      return { subject: "Free", classId: null };
    });
  });
  return out;
})();

/* ───────────── Exams & marks ───────────── */

export interface Exam {
  id: "ut1" | "mid";
  name: string;
  max: number;
  heldOn: string;
}

export const EXAMS: Exam[] = [
  { id: "ut1", name: "Unit Test 1", max: 50, heldOn: "2026-08-10" },
  { id: "mid", name: "Mid Term", max: 100, heldOn: "2026-10-05" },
];

export const UPCOMING_EXAMS = [
  { name: "Unit Test 2", subject: "Maths" as Subject, date: "2026-12-02" },
  { name: "Unit Test 2", subject: "Science" as Subject, date: "2026-12-03" },
  { name: "Unit Test 2", subject: "English" as Subject, date: "2026-12-04" },
  { name: "Unit Test 2", subject: "Hindi" as Subject, date: "2026-12-05" },
  { name: "Unit Test 2", subject: "Social" as Subject, date: "2026-12-07" },
  { name: "Unit Test 2", subject: "Computer" as Subject, date: "2026-12-08" },
  { name: "Term 1 Final", subject: "Maths" as Subject, date: "2027-01-18" },
];

/** marks[examId][studentId][subject] = score */
export type Marks = Record<string, Record<string, Record<Subject, number>>>;

const ABILITY: Record<string, number> = {
  s01: 0.82, s02: 0.91, s03: 0.7, s04: 0.86, s05: 0.76, s06: 0.94, s07: 0.66, s08: 0.88, s09: 0.73, s10: 0.8,
};
const SUBJECT_TILT: Partial<Record<string, Partial<Record<Subject, number>>>> = {
  s01: { Maths: -0.12, Computer: 0.1, Science: 0.04 }, // Aarav: weaker in Maths, strong in Computer
  s06: { Maths: 0.04 },
  s07: { English: 0.1, Maths: -0.06 },
};

function seedMarks(): Marks {
  const out: Marks = {};
  for (const exam of EXAMS) {
    out[exam.id] = {};
    for (const s of STUDENTS) {
      const r = rng(`${exam.id}-${s.id}`);
      const row = {} as Record<Subject, number>;
      for (const sub of SUBJECTS) {
        const growth = exam.id === "mid" ? 0.03 : 0; // a little better at mid term
        const p = ABILITY[s.id] + (SUBJECT_TILT[s.id]?.[sub] ?? 0) + growth + (r() - 0.5) * 0.1;
        row[sub] = Math.max(Math.round(exam.max * 0.35), Math.min(exam.max, Math.round(exam.max * p)));
      }
      out[exam.id][s.id] = row;
    }
  }
  return out;
}

/* ───────────── Attendance ───────────── */

export type AttendanceStatus = "P" | "A" | "L";
/** attendance[date][studentId] */
export type Attendance = Record<string, Record<string, AttendanceStatus>>;

function seedAttendance(days: string[]): Attendance {
  const out: Attendance = {};
  days.forEach((date, i) => {
    out[date] = {};
    for (const s of STUDENTS) {
      if (s.id === "s01") {
        // Aarav: 1 absence + 1 leave in 30 days (≈93%). Marking today absent drops it to ≈90%.
        out[date][s.id] = i === 9 ? "A" : i === 21 ? "L" : "P";
        continue;
      }
      const v = rng(`${date}-${s.id}`)();
      out[date][s.id] = v < 0.05 ? "A" : v < 0.07 ? "L" : "P";
    }
  });
  return out;
}

/* ───────────── Homework & notices ───────────── */

export type HomeworkStatus = "Pending" | "Submitted" | "Graded";

export interface Homework {
  id: string;
  subject: Subject;
  title: string;
  details: string;
  assignedOn: string;
  due: string;
  by: string;
  status: HomeworkStatus; // Aarav's status
  submitted: number; // how many of the class have submitted
}

export interface Notice {
  id: string;
  title: string;
  body: string;
  date: string;
  by: string;
  tag: "Event" | "Exam" | "Holiday" | "General" | "Class";
}

function seedHomework(today: Date): Homework[] {
  const d = (n: number) => isoDate(addDays(today, n));
  return [
    { id: "hw1", subject: "Maths", title: "Linear equations — Exercise 4.2", details: "Solve questions 1 to 15. Show every step.", assignedOn: d(-1), due: d(2), by: "Mrs. Meera Rao", status: "Pending", submitted: 3 },
    { id: "hw2", subject: "Science", title: "Draw and label a plant cell", details: "Use an A4 sheet. Label at least 8 parts.", assignedOn: d(-2), due: d(4), by: "Mr. Anil Verma", status: "Pending", submitted: 1 },
    { id: "hw3", subject: "English", title: "Essay: My favourite festival", details: "300 words, neat handwriting.", assignedOn: d(-6), due: d(-2), by: "Ms. Priya Nair", status: "Submitted", submitted: 9 },
    { id: "hw4", subject: "Social", title: "Map work: rivers of India", details: "Mark 10 major rivers on the outline map.", assignedOn: d(-10), due: d(-5), by: "Mrs. Kavita Iyer", status: "Graded", submitted: 10 },
  ];
}

function seedNotices(today: Date): Notice[] {
  const d = (n: number) => isoDate(addDays(today, n));
  return [
    { id: "n1", title: "Annual Sports Day on 28 November", body: "All students report by 7:30 am in house T-shirts. Parents are welcome from 9 am.", date: d(-1), by: "Mr. Rajesh Kumar", tag: "Event" },
    { id: "n2", title: "Unit Test 2 timetable released", body: "Unit Test 2 starts on 2 December with Maths. The full schedule is on the Exams page.", date: d(-3), by: "Exam Cell", tag: "Exam" },
    { id: "n3", title: "Parent–teacher meeting for Class 8", body: "PTM on Saturday, 21 November, 9 am to 12 pm in the respective classrooms.", date: d(-5), by: "Mrs. Meera Rao", tag: "Class" },
    { id: "n4", title: "School closed for Guru Nanak Jayanti", body: "The school will remain closed on 24 November. Classes resume the next day.", date: d(-8), by: "Office", tag: "Holiday" },
  ];
}

/* ───────────── Rewards ───────────── */

export const REWARD_POINTS: Record<string, number> = {
  s06: 1240, s02: 1180, s08: 1095, s04: 990, s01: 935, s10: 870, s05: 805, s09: 760, s03: 690, s07: 640,
};

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: "calendar" | "calculator" | "book" | "hand" | "flask";
  tint: string;
  earnedBy: string[];
}

export const BADGES: Badge[] = [
  { id: "b1", name: "Perfect week", description: "Present every day for a full week", icon: "calendar", tint: "indigo", earnedBy: ["s01", "s02", "s06", "s08", "s04", "s10"] },
  { id: "b2", name: "Maths whiz", description: "Scored 90% or more in a Maths test", icon: "calculator", tint: "accent", earnedBy: ["s06", "s02", "s08"] },
  { id: "b3", name: "Bookworm", description: "Read 10 books from the library", icon: "book", tint: "violet", earnedBy: ["s01", "s04", "s02"] },
  { id: "b4", name: "Helping hand", description: "Helped classmates during group work", icon: "hand", tint: "pink", earnedBy: ["s01", "s05", "s09", "s10"] },
  { id: "b5", name: "Science explorer", description: "Completed 5 science lab activities", icon: "flask", tint: "teal", earnedBy: ["s06", "s08", "s03"] },
];

export const POINT_HISTORY_AARAV = [
  { date: "2026-11-12", reason: "Submitted English essay before time", points: 20 },
  { date: "2026-11-09", reason: "Perfect week attendance", points: 50 },
  { date: "2026-11-03", reason: "Helped classmates in Science lab", points: 30 },
  { date: "2026-10-27", reason: "Library: finished 10th book", points: 75 },
  { date: "2026-10-16", reason: "Mid Term: 90%+ in Computer", points: 60 },
  { date: "2026-10-06", reason: "Late submission: Maths homework", points: -10 },
];

/* ───────────── Fees ───────────── */

export const ANNUAL_FEE = 48000;

export const FEES_8A: Record<string, { total: number; paid: number; dueDate: string }> = {
  s01: { total: ANNUAL_FEE, paid: 36000, dueDate: "2026-12-10" },
  s02: { total: ANNUAL_FEE, paid: 48000, dueDate: "2026-12-10" },
  s03: { total: ANNUAL_FEE, paid: 24000, dueDate: "2026-10-10" },
  s04: { total: ANNUAL_FEE, paid: 48000, dueDate: "2026-12-10" },
  s05: { total: ANNUAL_FEE, paid: 36000, dueDate: "2026-12-10" },
  s06: { total: ANNUAL_FEE, paid: 48000, dueDate: "2026-12-10" },
  s07: { total: ANNUAL_FEE, paid: 12000, dueDate: "2026-07-10" },
  s08: { total: ANNUAL_FEE, paid: 36000, dueDate: "2026-12-10" },
  s09: { total: ANNUAL_FEE, paid: 36000, dueDate: "2026-12-10" },
  s10: { total: ANNUAL_FEE, paid: 24000, dueDate: "2026-10-10" },
};

export const DEFAULTERS = [
  { name: "Kabir Mehta", classId: "8-A", pending: 36000, overdueDays: 127, parent: "Nisha Mehta", phone: "98922 30177" },
  { name: "Tanvi Deshpande", classId: "10-B", pending: 28000, overdueDays: 96, parent: "Mahesh Deshpande", phone: "98220 19034" },
  { name: "Vihaan Gupta", classId: "8-A", pending: 24000, overdueDays: 35, parent: "Rakesh Gupta", phone: "98100 76243" },
  { name: "Myra Joshi", classId: "8-A", pending: 24000, overdueDays: 35, parent: "Amit Joshi", phone: "90040 55219" },
  { name: "Aditya Pawar", classId: "9-A", pending: 24000, overdueDays: 35, parent: "Sanjay Pawar", phone: "97660 82110" },
  { name: "Zoya Khan", classId: "7-B", pending: 16000, overdueDays: 35, parent: "Imran Khan", phone: "98190 66412" },
  { name: "Neel Chatterjee", classId: "6-A", pending: 12000, overdueDays: 35, parent: "Rina Chatterjee", phone: "98310 20745" },
];

/* ───────────── Admin / whole school ───────────── */

export interface ClassInfo {
  id: string;
  classTeacher: string;
  students: number;
  room: string;
}

export const CLASSES: ClassInfo[] = [
  { id: "6-A", classTeacher: "Mrs. Sunita Pillai", students: 42, room: "101" },
  { id: "6-B", classTeacher: "Mr. Farhan Ali", students: 41, room: "102" },
  { id: "7-A", classTeacher: "Mr. Anil Verma", students: 44, room: "201" },
  { id: "7-B", classTeacher: "Mr. Suresh Yadav", students: 43, room: "202" },
  { id: "8-A", classTeacher: "Mrs. Meera Rao", students: 10, room: "204" },
  { id: "8-B", classTeacher: "Mrs. Kavita Iyer", students: 45, room: "205" },
  { id: "9-A", classTeacher: "Ms. Priya Nair", students: 46, room: "301" },
  { id: "9-B", classTeacher: "Mr. Gaurav Sinha", students: 44, room: "302" },
  { id: "10-A", classTeacher: "Mrs. Rekha Menon", students: 47, room: "303" },
  { id: "10-B", classTeacher: "Mr. Rohan Das", students: 45, room: "304" },
  { id: "11-A", classTeacher: "Dr. Neha Kapoor", students: 47, room: "401" },
  { id: "12-A", classTeacher: "Mr. Vivek Saxena", students: 46, room: "402" },
];

export const ADMIN_STATS = {
  totalStudents: 500,
  totalTeachers: 28,
  /** Students outside 8-A present today (out of 490). 8-A comes live from the store. */
  otherClassesPresentToday: 461,
  otherClassesStudents: 490,
  feesTotal: 500 * ANNUAL_FEE,
  feesCollected: 20235000,
  feesCollectedThisMonth: 1842000,
};

/** School-wide attendance %, last 13 school days before today. Today's value is computed live. */
export const ATTENDANCE_TREND_BASE = [93.8, 94.6, 92.1, 95.0, 94.2, 91.7, 93.5, 94.9, 95.3, 92.8, 94.0, 93.1, 94.7];

export const FEES_BY_MONTH = [
  { month: "Jun", collected: 6420000 },
  { month: "Jul", collected: 3810000 },
  { month: "Aug", collected: 2150000 },
  { month: "Sep", collected: 1960000 },
  { month: "Oct", collected: 4053000 },
  { month: "Nov", collected: 1842000 },
];

/* ───────────── Teacher extras ───────────── */

export const TEACHER_TASKS = [
  { id: "tt1", title: "Check Exercise 4.2 notebooks", due: "Today" },
  { id: "tt2", title: "Send PTM reminders to 8-A parents", due: "Tomorrow" },
  { id: "tt3", title: "Set Unit Test 2 Maths paper", due: "25 Nov" },
];

/* ───────────── Seed (mutable demo state) ───────────── */

export interface SeedState {
  seededFor: string;
  attendance: Attendance;
  marks: Marks;
  homework: Homework[];
  notices: Notice[];
}

/**
 * Builds the editable demo state relative to today:
 * 30 school days of attendance ending yesterday (today is left for the teacher to mark),
 * marks for both exams, 4 homework items and 4 notices.
 */
export function createSeed(now = new Date()): SeedState {
  const today = schoolToday(now);
  const days = lastSchoolDays(addDays(today, -1), 30);
  return {
    seededFor: isoDate(today),
    attendance: seedAttendance(days),
    marks: seedMarks(),
    homework: seedHomework(today),
    notices: seedNotices(today),
  };
}

/* ───────────── Guidance bot ───────────── */

export const BOT_SCRIPTS = [
  {
    q: "How do I improve in Maths?",
    a: "Your Maths scores are your lowest right now (Unit Test 1: {ut1Maths}/50, Mid Term: {midMaths}/100), so small daily practice will help most.\n\n1. Spend 30 minutes on Maths every day, before other homework.\n2. Redo every question you got wrong in the Mid Term — understand the mistake, not just the answer.\n3. Linear equations and mensuration carry the most marks in Unit Test 2. Start there.\n4. Ask Mrs. Meera Rao for the extra practice sheet. Her doubt-clearing class is on Thursdays after period 7.",
  },
  {
    q: "Make me a study plan for exams",
    a: "Unit Test 2 starts on 2 December. Here is a 2-week plan:\n\nWeek 1\n• Mon, Wed, Fri: Maths (1 hr) + Science (45 min)\n• Tue, Thu: English and Hindi (45 min each)\n• Sat: Social — one chapter + map practice\n\nWeek 2\n• Daily: one past paper, alternating subjects\n• Revise formulas and definitions every night for 15 minutes\n• Day before each exam: light revision only, sleep by 10 pm",
  },
  {
    q: "How can I earn more reward points?",
    a: "You have 935 points and are 5th in the class. Ways to earn more:\n\n• Submit homework on time: +10 each\n• Perfect week attendance: +50\n• Score 90% or more in any test: +60\n• Help in lab or group work: +30\n\nYou need 56 more points to pass Diya and reach 4th place.",
  },
  {
    q: "I feel stressed about exams",
    a: "That is completely normal, and it means you care. A few things that help:\n\n• Break study into 25-minute blocks with a 5-minute break.\n• Sleep 8 hours — your memory works best when rested.\n• Talk to someone: your parents, Mrs. Meera Rao, or the school counsellor, Ms. Anjali (Room 108, open every day 10 am – 1 pm).\n• Go outside for 15 minutes every day.\n\nYou have done well this term — {att}% attendance and strong Computer and Science scores.",
  },
];

export const BOT_FALLBACK =
  "Thanks for asking. I'm a demo guide, so I can only answer the suggested questions for now. Try one of the topics above, or speak to your class teacher, Mrs. Meera Rao.";
