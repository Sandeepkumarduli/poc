"use client";

/** Shared Recharts tooltip: dark card, colour swatch beside each value, text in ink tokens. */
export function ChartTooltip({
  active,
  payload,
  label,
  format = (v: number) => String(v),
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string; payload?: Record<string, unknown> }>;
  label?: string | number;
  format?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-ink px-3.5 py-2.5 text-[13px] text-white shadow-lg">
      <div className="mb-1 font-medium">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-white/80">
          <span className="size-2.5 rounded-sm" style={{ background: p.color }} />
          <span className="flex-1">{p.name}</span>
          <span className="tabular ml-4 font-medium text-white">{format(Number(p.value))}</span>
        </div>
      ))}
    </div>
  );
}
