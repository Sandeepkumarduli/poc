export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Local YYYY-MM-DD (not UTC, so dates match the user's day). */
export function isoDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseISO(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

/** School runs Monday to Saturday. On a Sunday, "today" is the previous Saturday. */
export function schoolToday(now = new Date()) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (d.getDay() === 0) return addDays(d, -1);
  return d;
}

/** The last `n` school days ending at (and including) `end`, oldest first. */
export function lastSchoolDays(end: Date, n: number) {
  const out: string[] = [];
  let d = new Date(end);
  while (out.length < n) {
    if (d.getDay() !== 0) out.push(isoDate(d));
    d = addDays(d, -1);
  }
  return out.reverse();
}

export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;
export type Day = (typeof DAYS)[number];

export function dayName(d: Date): Day | null {
  const i = d.getDay();
  return i === 0 ? null : DAYS[i - 1];
}

export function fmtDate(s: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" }) {
  return parseISO(s).toLocaleDateString("en-IN", opts);
}

export function fmtINR(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

/** ₹2.02 Cr / ₹37.6 L style compact rupees. */
export function fmtINRCompact(n: number) {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  return fmtINR(n);
}

export function initials(name: string) {
  return name
    .replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/i, "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function daysFromToday(s: string) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((parseISO(s).getTime() - today.getTime()) / 86400000);
}

/** Small deterministic PRNG so the seed data looks random but is stable. */
export function rng(seedStr: string) {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
