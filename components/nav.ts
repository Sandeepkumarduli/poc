import type { Role } from "@/data/mock";
import type { IconName } from "./Icon";

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
}

export const NAV: Record<Role, NavItem[]> = {
  student: [
    { href: "/student", label: "Home", icon: "grid" },
    { href: "/student/attendance", label: "Attendance", icon: "calendarCheck" },
    { href: "/student/marks", label: "Marks", icon: "chart" },
    { href: "/student/timetable", label: "Timetable", icon: "clock" },
    { href: "/student/homework", label: "Homework", icon: "book" },
    { href: "/student/notices", label: "Notices", icon: "bell" },
    { href: "/student/rewards", label: "Rewards", icon: "trophy" },
    { href: "/student/guidance", label: "Guide", icon: "chat" },
  ],
  teacher: [
    { href: "/teacher", label: "Home", icon: "grid" },
    { href: "/teacher/attendance", label: "Attendance", icon: "calendarCheck" },
    { href: "/teacher/marks", label: "Marks", icon: "pencil" },
    { href: "/teacher/homework", label: "Homework", icon: "book" },
    { href: "/teacher/notices", label: "Notices", icon: "megaphone" },
    { href: "/teacher/timetable", label: "Timetable", icon: "clock" },
  ],
  admin: [
    { href: "/admin", label: "Home", icon: "grid" },
    { href: "/admin/classes", label: "Classes", icon: "building" },
    { href: "/admin/timetable", label: "Timetable", icon: "clock" },
    { href: "/admin/fees", label: "Fees", icon: "wallet" },
    { href: "/admin/reports", label: "Reports", icon: "file" },
  ],
};

export const ROLE_LABEL: Record<Role, string> = { student: "Student", teacher: "Teacher", admin: "Admin" };
