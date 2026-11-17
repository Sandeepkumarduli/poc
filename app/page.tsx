"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp, useHydrated } from "@/lib/store";
import { LogoMark } from "@/components/Icon";

export default function Index() {
  const hydrated = useHydrated();
  const session = useApp((s) => s.session);
  const router = useRouter();
  useEffect(() => {
    if (hydrated) router.replace(session ? `/${session.role}` : "/login");
  }, [hydrated, session, router]);
  return (
    <div className="grid min-h-dvh place-items-center">
      <LogoMark size={44} />
    </div>
  );
}
