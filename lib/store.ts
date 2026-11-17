"use client";

import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  USERS,
  createSeed,
  type AttendanceStatus,
  type Homework,
  type Notice,
  type Role,
  type SeedState,
  type Subject,
  type User,
} from "@/data/mock";
import { isoDate, schoolToday } from "@/lib/utils";

export type Session = Omit<User, "password">;

interface AppState extends SeedState {
  session: Session | null;
  /** true once anything was edited, so we never silently re-seed edited data */
  dirty: boolean;
  login: (email: string, password: string) => Role | null;
  logout: () => void;
  saveAttendance: (date: string, rows: Record<string, AttendanceStatus>) => void;
  saveMarks: (examId: string, subject: Subject, rows: Record<string, number>) => void;
  addHomework: (hw: Pick<Homework, "subject" | "title" | "details" | "due" | "by">) => void;
  submitHomework: (id: string) => void;
  addNotice: (n: Pick<Notice, "title" | "body" | "by" | "tag">) => void;
  resetDemo: () => void;
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      ...createSeed(),
      session: null,
      dirty: false,

      login: (email, password) => {
        const u = USERS.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password);
        if (!u) return null;
        const { password: _pw, ...session } = u;
        void _pw;
        set({ session });
        return u.role;
      },

      logout: () => set({ session: null }),

      saveAttendance: (date, rows) =>
        set((s) => ({ attendance: { ...s.attendance, [date]: { ...rows } }, dirty: true })),

      saveMarks: (examId, subject, rows) =>
        set((s) => {
          const exam = { ...s.marks[examId] };
          for (const [sid, v] of Object.entries(rows)) exam[sid] = { ...exam[sid], [subject]: v };
          return { marks: { ...s.marks, [examId]: exam }, dirty: true };
        }),

      addHomework: (hw) =>
        set((s) => ({
          homework: [
            { ...hw, id: `hw${Date.now()}`, assignedOn: isoDate(new Date()), status: "Pending", submitted: 0 },
            ...s.homework,
          ],
          dirty: true,
        })),

      submitHomework: (id) =>
        set((s) => ({
          homework: s.homework.map((h) => (h.id === id ? { ...h, status: "Submitted", submitted: h.submitted + 1 } : h)),
          dirty: true,
        })),

      addNotice: (n) =>
        set((s) => ({
          notices: [{ ...n, id: `n${Date.now()}`, date: isoDate(new Date()) }, ...s.notices],
          dirty: true,
        })),

      resetDemo: () => set({ ...createSeed(), dirty: false, session: get().session }),
    }),
    {
      name: "studentkitpro-demo-v1",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Untouched demo data from an earlier day is re-seeded so dates stay current.
        // Deferred: with localStorage this callback can run while the store is still being created.
        if (state && !state.dirty && state.seededFor !== isoDate(schoolToday())) {
          queueMicrotask(() => useApp.setState({ ...createSeed() }));
        }
      },
    },
  ),
);

/** true after the persisted store has loaded from localStorage (avoids hydration flashes). */
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => {
    if (useApp.persist.hasHydrated()) setH(true);
    return useApp.persist.onFinishHydration(() => setH(true));
  }, []);
  return h;
}

/* ───────────── Toasts (not persisted) ───────────── */

interface Toast {
  id: number;
  message: string;
  tone: "success" | "info" | "error";
}

export const useToasts = create<{ toasts: Toast[]; push: (m: string, tone?: Toast["tone"]) => void; dismiss: (id: number) => void }>(
  (set) => ({
    toasts: [],
    push: (message, tone = "success") => {
      const id = Date.now() + Math.random();
      set((s) => ({ toasts: [...s.toasts, { id, message, tone }] }));
      setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3200);
    },
    dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  }),
);

export const toast = (m: string, tone?: Toast["tone"]) => useToasts.getState().push(m, tone);
