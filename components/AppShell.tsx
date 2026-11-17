"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { Role } from "@/data/mock";
import { useApp, useHydrated } from "@/lib/store";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { LogoMark } from "./Icon";

/**
 * Route guard + layout for one role.
 * Logged out → /login. Logged in as another role → that role's dashboard.
 */
export function AppShell({ role, children }: { role: Role; children: ReactNode }) {
  const hydrated = useHydrated();
  const session = useApp((s) => s.session);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (!hydrated) return;
    if (!session) router.replace("/login");
    else if (session.role !== role) router.replace(`/${session.role}`);
  }, [hydrated, session, role, router]);

  if (!hydrated || !session || session.role !== role) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <div className="fade-in flex flex-col items-center gap-3 text-sm text-ink-3">
          <LogoMark size={44} />
          Loading
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <Sidebar role={role} />
      <div className="px-4 pb-28 pt-4 sm:px-6 md:ml-[120px] md:pb-10 md:pl-0 md:pr-8 md:pt-6">
        <div className="mx-auto max-w-[1440px]">
          <Topbar session={session} />
          {/* key on path so every page replays its entrance animation */}
          <main key={path}>{children}</main>
        </div>
      </div>
    </div>
  );
}
