"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp, type Session } from "@/lib/store";
import { SCHOOL } from "@/data/mock";
import { Avatar } from "./ui";
import { Icon, LogoMark } from "./Icon";
import { ROLE_LABEL } from "./nav";

export function Topbar({ session }: { session: Session }) {
  const router = useRouter();
  const logout = useApp((s) => s.logout);
  const noticeCount = useApp((s) => s.notices.length);
  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <header className="no-print fade-in mb-6 flex items-center gap-3">
      <Link href={`/${session.role}`} className="md:hidden" aria-label="Home">
        <LogoMark size={38} />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] text-ink-3">{today}</div>
        <div className="truncate text-sm font-medium text-ink">
          StudentKitPro <span className="text-ink-3">· {SCHOOL.name}</span>
        </div>
      </div>

      {session.role !== "admin" && (
        <Link
          href={`/${session.role}/notices`}
          aria-label="Notices"
          className="relative hidden size-11 place-items-center rounded-full border border-line bg-surface text-ink-2 transition-colors hover:text-ink sm:grid"
        >
          <Icon name="bell" size={19} />
          <span className="tabular absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-accent text-[11px] font-semibold text-white">{noticeCount}</span>
        </Link>
      )}

      <div className="flex items-center gap-3 rounded-full border border-line bg-surface py-1.5 pl-1.5 pr-2 sm:pr-3">
        <Avatar name={session.name} size={36} />
        <div className="hidden leading-tight sm:block">
          <div className="text-sm font-semibold text-ink">{session.name}</div>
          <div className="text-xs text-ink-3">{session.title}</div>
        </div>
        <span className="rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent-strong">{ROLE_LABEL[session.role]}</span>
        <button
          onClick={() => {
            logout();
            router.replace("/login");
          }}
          className="grid size-9 place-items-center rounded-full text-ink-2 transition-colors hover:bg-subtle hover:text-ink"
          aria-label="Log out"
          title="Log out"
        >
          <Icon name="logout" size={18} />
        </button>
      </div>
    </header>
  );
}
