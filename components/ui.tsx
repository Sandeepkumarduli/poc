import type { CSSProperties, ReactNode, ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { cn, initials } from "@/lib/utils";
import { Icon, type IconName } from "./Icon";

/** Wraps content in the staggered rise-in entrance. */
export function Reveal({ i = 0, className, children, as: Tag = "div" }: { i?: number; className?: string; children: ReactNode; as?: "div" | "section" | "li" }) {
  return (
    <Tag className={cn("rise", className)} style={{ "--i": i } as CSSProperties}>
      {children}
    </Tag>
  );
}

export function Card({ className, children, i, tint }: { className?: string; children: ReactNode; i?: number; tint?: string }) {
  return (
    <Reveal i={i} className={cn("rounded-[var(--radius-card)] border border-line p-5 sm:p-6", tint ?? "bg-surface", className)}>
      {children}
    </Reveal>
  );
}

export function CardHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h2 className="text-[17px] font-semibold text-ink">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-ink-3">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-2">{subtitle}</p>}
      </div>
      {action}
    </Reveal>
  );
}

export function StatCard({
  label,
  value,
  note,
  noteTone = "muted",
  icon,
  i,
  href,
}: {
  label: string;
  value: ReactNode;
  note?: string;
  noteTone?: "up" | "down" | "muted";
  icon?: IconName;
  i?: number;
  href?: string;
}) {
  const body = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-2">{label}</span>
        {icon && (
          <span className="grid size-9 place-items-center rounded-full bg-subtle text-ink-2">
            <Icon name={icon} size={17} />
          </span>
        )}
      </div>
      <div className="tabular mt-3 text-[30px] font-semibold leading-none tracking-tight text-ink">{value}</div>
      {note && (
        <p className={cn("mt-2.5 text-[13px]", noteTone === "up" && "text-ok", noteTone === "down" && "text-bad", noteTone === "muted" && "text-ink-3")}>
          {noteTone === "up" && "↑ "}
          {noteTone === "down" && "↓ "}
          {note}
        </p>
      )}
    </>
  );
  return (
    <Reveal i={i} className="h-full">
      {href ? (
        <Link href={href} className="block h-full rounded-[var(--radius-card)] border border-line bg-surface p-5 transition-colors hover:border-ink/15 hover:bg-white">
          {body}
        </Link>
      ) : (
        <div className="h-full rounded-[var(--radius-card)] border border-line bg-surface p-5">{body}</div>
      )}
    </Reveal>
  );
}

const PILL_TONES = {
  ok: "bg-ok-soft text-ok",
  bad: "bg-bad-soft text-bad",
  warn: "bg-warn-soft text-warn",
  neutral: "bg-subtle text-ink-2",
  accent: "bg-accent-soft text-accent-strong",
  indigo: "bg-indigo-soft text-indigo",
  violet: "bg-violet-soft text-violet",
  pink: "bg-pink-soft text-pink",
  teal: "bg-teal-soft text-teal",
  dark: "bg-ink text-white",
} as const;
export type Tone = keyof typeof PILL_TONES;

export function Pill({ tone = "neutral", children, dot, className }: { tone?: Tone; children: ReactNode; dot?: boolean; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", PILL_TONES[tone], className)}>
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  icon,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "dark" | "ghost" | "outline"; size?: "sm" | "md"; icon?: IconName }) {
  return (
    <button
      {...rest}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-[background-color,color,border-color,transform] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        size === "md" ? "h-11 px-5 text-sm" : "h-9 px-3.5 text-[13px]",
        variant === "primary" && "bg-accent-strong text-white hover:bg-[#a93c16]",
        variant === "dark" && "bg-ink text-white hover:bg-[#35302b]",
        variant === "ghost" && "text-ink-2 hover:bg-subtle hover:text-ink",
        variant === "outline" && "border border-line bg-surface text-ink hover:bg-subtle",
        className,
      )}
    >
      {icon && <Icon name={icon} size={16} />}
      {children}
    </button>
  );
}

const AVATAR_TINTS = ["bg-indigo-soft text-indigo", "bg-accent-soft text-accent-strong", "bg-teal-soft text-teal", "bg-violet-soft text-violet", "bg-pink-soft text-pink", "bg-warn-soft text-warn"];

export function Avatar({ name, size = 36, className }: { name: string; size?: number; className?: string }) {
  const n = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return (
    <span
      className={cn("inline-grid shrink-0 place-items-center rounded-full font-semibold", AVATAR_TINTS[n % AVATAR_TINTS.length], className)}
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.36) }}
    >
      {initials(name)}
    </span>
  );
}

/** Animated progress ring. */
export function Ring({ value, size = 96, stroke = 10, color = "var(--color-indigo)", track = "var(--color-indigo-soft)", children }: { value: number; size?: number; stroke?: number; color?: string; track?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          className="ring-anim"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(100, value) / 100)}
          style={{ "--ring-full": c, transition: "stroke-dashoffset .6s var(--ease-out-soft)" } as CSSProperties}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  );
}

/** Thin horizontal bar that grows in. */
export function Bar({ value, i = 0, color = "bg-indigo", track = "bg-subtle" }: { value: number; i?: number; color?: string; track?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full", track)}>
      <div className={cn("bar-anim h-full rounded-full", color)} style={{ width: `${Math.min(100, value)}%`, "--i": i } as CSSProperties} />
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-3">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "h-11 w-full rounded-xl border border-line bg-subtle px-3.5 text-sm text-ink outline-none transition-[border-color,background-color] placeholder:text-ink-3 focus:border-accent focus:bg-white";

export function Segmented<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-xl border border-line bg-subtle p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "h-8 rounded-lg px-3.5 text-[13px] font-medium transition-colors",
            value === o.value ? "bg-ink text-white" : "text-ink-2 hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
