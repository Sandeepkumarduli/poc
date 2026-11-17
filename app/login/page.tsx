"use client";

import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { DEMO_PASSWORD, SCHOOL, USERS } from "@/data/mock";
import { useApp, useHydrated } from "@/lib/store";
import { Icon, LogoMark } from "@/components/Icon";
import { Avatar, Button, Field, Ring, inputCls } from "@/components/ui";
import { ROLE_LABEL } from "@/components/nav";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const hydrated = useHydrated();
  const session = useApp((s) => s.session);
  const login = useApp((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // Already logged in → straight to the dashboard
  useEffect(() => {
    if (hydrated && session && !busy) router.replace(`/${session.role}`);
  }, [hydrated, session, router, busy]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    const role = login(email, password);
    if (!role) {
      setError("Email or password is incorrect. Try one of the demo accounts below.");
      return;
    }
    setBusy(true);
    router.replace(`/${role}`);
  };

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      {/* Brand panel */}
      <section className="relative hidden overflow-hidden bg-rail p-12 text-white lg:flex lg:flex-col">
        <div className="rise flex items-center gap-3">
          <LogoMark size={44} />
          <span className="text-lg font-semibold">StudentKitPro</span>
        </div>
        <div className="mt-auto max-w-lg">
          <h1 className="rise text-[40px] font-semibold leading-[1.15] tracking-tight" style={{ "--i": 1 } as CSSProperties}>
            Attendance, marks and homework in one place
          </h1>
          <p className="rise mt-4 text-base text-white/65" style={{ "--i": 2 } as CSSProperties}>
            One portal for the students, teachers and principal of {SCHOOL.name}, {SCHOOL.city}.
          </p>
        </div>

        {/* Product preview */}
        <div className="mt-10 grid max-w-xl grid-cols-[1.1fr_1fr] gap-4">
          <div className="rise rounded-3xl bg-white p-5 text-ink" style={{ "--i": 3 } as CSSProperties}>
            <div className="text-sm text-ink-2">Attendance this term</div>
            <div className="mt-3 flex items-center gap-4">
              <Ring value={93} size={84} stroke={9}>
                <span className="tabular text-lg font-semibold">93%</span>
              </Ring>
              <div className="text-[13px] text-ink-3">
                <div><span className="font-semibold text-ok">28</span> present</div>
                <div><span className="font-semibold text-bad">1</span> absent</div>
                <div><span className="font-semibold text-warn">1</span> leave</div>
              </div>
            </div>
          </div>
          <div className="rise flex flex-col justify-between rounded-3xl bg-accent p-5" style={{ "--i": 4 } as CSSProperties}>
            <div className="flex items-center justify-between text-sm text-white/85">
              Reward points
              <Icon name="trophy" size={18} />
            </div>
            <div>
              <div className="tabular text-[34px] font-semibold leading-none">935</div>
              <div className="mt-1.5 text-[13px] text-white/80">5th in Class 8-A</div>
            </div>
          </div>
          <div className="rise col-span-2 flex items-center gap-3 rounded-3xl bg-rail-2 p-4" style={{ "--i": 5 } as CSSProperties}>
            <span className="grid size-10 place-items-center rounded-2xl bg-white/10 text-white">
              <Icon name="book" size={19} />
            </span>
            <div className="flex-1">
              <div className="text-sm font-medium">Linear equations — Exercise 4.2</div>
              <div className="text-xs text-white/55">Maths · due in 2 days</div>
            </div>
            <span className="rounded-full bg-warn-soft px-2.5 py-1 text-xs font-medium text-warn">Pending</span>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-[420px]">
          <div className="rise mb-8 flex items-center gap-3 lg:hidden">
            <LogoMark size={40} />
            <span className="text-lg font-semibold">StudentKitPro</span>
          </div>
          <h2 className="rise text-[28px] font-semibold tracking-tight">Log in</h2>
          <p className="rise mt-1 text-sm text-ink-2" style={{ "--i": 1 } as CSSProperties}>
            Use your school email. You will land on your own dashboard.
          </p>

          <form onSubmit={submit} className="rise mt-8 space-y-4" style={{ "--i": 2 } as CSSProperties} noValidate>
            <Field label="Email">
              <input className={inputCls} type="email" autoComplete="username" placeholder="name@school.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Field>
            <Field label="Password">
              <div className="relative">
                <input className={cn(inputCls, "pr-12")} type={show ? "text" : "password"} autoComplete="current-password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-ink-3 hover:text-ink" aria-label={show ? "Hide password" : "Show password"}>
                  <Icon name="eye" size={17} />
                </button>
              </div>
            </Field>
            {error && (
              <p className="fade-in flex items-start gap-2 rounded-xl bg-bad-soft px-3.5 py-2.5 text-sm text-bad" role="alert">
                <Icon name="info" size={17} className="mt-px shrink-0" />
                {error}
              </p>
            )}
            <Button type="submit" variant="dark" className="w-full" disabled={busy}>
              {busy ? "Opening dashboard" : "Log in"}
              {!busy && <Icon name="arrowRight" size={16} />}
            </Button>
          </form>

          <div className="rise mt-8 rounded-2xl border border-line bg-surface p-4" style={{ "--i": 3 } as CSSProperties}>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-semibold">Demo accounts</span>
              <span className="text-xs text-ink-3">
                Password <code className="rounded bg-subtle px-1.5 py-0.5 font-mono text-ink-2">{DEMO_PASSWORD}</code>
              </span>
            </div>
            <ul className="space-y-1">
              {USERS.map((u) => (
                <li key={u.email}>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail(u.email);
                      setPassword(DEMO_PASSWORD);
                      setError("");
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-subtle"
                  >
                    <Avatar name={u.name} size={32} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{u.email}</span>
                      <span className="block truncate text-xs text-ink-3">{u.name}</span>
                    </span>
                    <span className="text-xs text-ink-3">{ROLE_LABEL[u.role]}</span>
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-2 px-2 text-xs text-ink-3">Click an account to fill the form.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
