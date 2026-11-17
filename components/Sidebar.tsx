"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { CSSProperties } from "react";
import type { Role } from "@/data/mock";
import { toast, useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Icon, LogoMark } from "./Icon";
import { NAV } from "./nav";

function isActive(path: string, href: string, root: string) {
  return href === root ? path === root : path.startsWith(href);
}

/** Floating dark rail on desktop, bottom tab bar on phones. */
export function Sidebar({ role }: { role: Role }) {
  const path = usePathname();
  const router = useRouter();
  const logout = useApp((s) => s.logout);
  const resetDemo = useApp((s) => s.resetDemo);
  const items = NAV[role];
  const root = `/${role}`;

  const doLogout = () => {
    logout();
    router.replace("/login");
  };
  const doReset = () => {
    if (!confirm("Restore all original demo data? Attendance, marks, homework and notices changes will be lost.")) return;
    resetDemo();
    toast("Demo data restored");
  };

  return (
    <>
      {/* Desktop rail */}
      <aside className="no-print fixed inset-y-4 left-4 z-30 hidden w-[88px] flex-col items-center rounded-[36px] bg-rail py-5 shadow-[0_12px_40px_-12px_rgb(31_27_24/0.45)] md:flex">
        <Link href={root} aria-label="StudentKitPro home" className="pop-in">
          <LogoMark size={46} />
        </Link>
        <nav className="no-scrollbar mt-8 flex flex-1 flex-col items-center gap-1.5 overflow-y-auto">
          {items.map((it, i) => {
            const active = isActive(path, it.href, root);
            return (
              <Link
                key={it.href}
                href={it.href}
                className="rise group flex w-[72px] flex-col items-center gap-1 py-1.5"
                style={{ "--i": i } as CSSProperties}
              >
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-2xl border transition-colors",
                    active ? "border-accent bg-rail-2 text-accent" : "border-transparent text-white/80 group-hover:bg-rail-2 group-hover:text-white",
                  )}
                >
                  <Icon name={it.icon} size={20} />
                </span>
                <span className={cn("text-[11px] leading-none", active ? "text-white" : "text-white/55 group-hover:text-white/85")}>{it.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 flex flex-col items-center gap-1.5">
          {role === "admin" && (
            <button onClick={doReset} className="group flex w-[72px] flex-col items-center gap-1 py-1.5" title="Reset demo data">
              <span className="grid size-11 place-items-center rounded-2xl text-white/80 transition-colors group-hover:bg-rail-2 group-hover:text-white">
                <Icon name="refresh" size={19} />
              </span>
              <span className="text-[11px] leading-none text-white/55 group-hover:text-white/85">Reset demo</span>
            </button>
          )}
          <button onClick={doLogout} className="group flex w-[72px] flex-col items-center gap-1 py-1.5" title="Log out">
            <span className="grid size-11 place-items-center rounded-2xl text-white/80 transition-colors group-hover:bg-rail-2 group-hover:text-white">
              <Icon name="logout" size={19} />
            </span>
            <span className="text-[11px] leading-none text-white/55 group-hover:text-white/85">Log out</span>
          </button>
        </div>
      </aside>

      {/* Phone tab bar */}
      <nav className="no-print fixed inset-x-3 bottom-3 z-30 flex items-center gap-1 overflow-x-auto rounded-[28px] bg-rail px-2 py-2 shadow-[0_12px_40px_-12px_rgb(31_27_24/0.5)] no-scrollbar md:hidden">
        {items.map((it) => {
          const active = isActive(path, it.href, root);
          return (
            <Link key={it.href} href={it.href} className="flex min-w-[60px] flex-1 flex-col items-center gap-1 rounded-2xl py-1.5">
              <span className={cn("grid size-9 place-items-center rounded-xl border", active ? "border-accent text-accent" : "border-transparent text-white/75")}>
                <Icon name={it.icon} size={18} />
              </span>
              <span className={cn("text-[11px] leading-none", active ? "text-white" : "text-white/55")}>{it.label}</span>
            </Link>
          );
        })}
        {role === "admin" && (
          <button onClick={doReset} className="flex min-w-[60px] flex-1 flex-col items-center gap-1 py-1.5">
            <span className="grid size-9 place-items-center text-white/75">
              <Icon name="refresh" size={18} />
            </span>
            <span className="text-[11px] leading-none text-white/55">Reset</span>
          </button>
        )}
      </nav>
    </>
  );
}
