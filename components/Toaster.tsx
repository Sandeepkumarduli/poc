"use client";

import { useToasts } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Icon } from "./Icon";

export function Toaster() {
  const { toasts, dismiss } = useToasts();
  return (
    <div className="pointer-events-none fixed inset-x-4 top-4 z-50 flex flex-col items-end gap-2 sm:left-auto sm:right-6 sm:top-6" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="slide-in-right pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-white shadow-[0_16px_40px_-12px_rgb(31_27_24/0.55)]">
          <span className={cn("grid size-7 shrink-0 place-items-center rounded-full", t.tone === "error" ? "bg-bad" : t.tone === "info" ? "bg-indigo" : "bg-ok")}>
            <Icon name={t.tone === "error" ? "x" : t.tone === "info" ? "info" : "check"} size={15} strokeWidth={2.25} />
          </span>
          <span className="flex-1">{t.message}</span>
          <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-white/60 hover:text-white">
            <Icon name="x" size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
