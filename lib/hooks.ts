"use client";

import { useMemo } from "react";
import { useApp } from "./store";
import { dayName, isoDate, schoolToday } from "./utils";

export function useToday() {
  return useMemo(() => {
    const d = schoolToday();
    return { date: d, iso: isoDate(d), day: dayName(d) };
  }, []);
}

/** The logged-in student's id (Aarav in the demo). */
export function useStudentId() {
  return useApp((s) => s.session?.studentId ?? "s01");
}
