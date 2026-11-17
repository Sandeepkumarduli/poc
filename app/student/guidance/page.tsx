"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { BOT_FALLBACK, BOT_SCRIPTS } from "@/data/mock";
import { useApp } from "@/lib/store";
import { useStudentId } from "@/lib/hooks";
import { studentAttendance } from "@/lib/selectors";
import { cn } from "@/lib/utils";
import { Avatar, Card, PageHeader } from "@/components/ui";
import { Icon, LogoMark } from "@/components/Icon";

interface Msg {
  id: number;
  from: "bot" | "me";
  text: string;
}

export default function Guidance() {
  const sid = useStudentId();
  const session = useApp((s) => s.session);
  const marks = useApp((s) => s.marks);
  const attendance = useApp((s) => s.attendance);
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 0, from: "bot", text: `Hi ${session?.name.split(" ")[0] ?? "there"}. I'm your study guide. Pick a question below or type your own.` },
  ]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, typing]);

  // Fill live numbers into the canned answers
  const fill = (t: string) =>
    t
      .replace("{ut1Maths}", String(marks.ut1?.[sid]?.Maths ?? "-"))
      .replace("{midMaths}", String(marks.mid?.[sid]?.Maths ?? "-"))
      .replace("{att}", String(Math.round(studentAttendance(attendance, sid).pct)));

  const ask = (q: string) => {
    if (!q.trim() || typing) return;
    const script = BOT_SCRIPTS.find((s) => s.q.toLowerCase() === q.trim().toLowerCase());
    setMsgs((m) => [...m, { id: Date.now(), from: "me", text: q.trim() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { id: Date.now() + 1, from: "bot", text: script ? fill(script.a) : BOT_FALLBACK }]);
      setTyping(false);
    }, script ? 1300 : 800);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <>
      <PageHeader title="Guidance" subtitle="Study tips and plans, based on your marks and attendance" />
      <Card i={1} className="flex h-[calc(100dvh-260px)] min-h-[480px] flex-col p-0 sm:p-0">
        <div className="flex items-center gap-3 border-b border-line px-5 py-4">
          <LogoMark size={36} />
          <div>
            <div className="text-sm font-semibold">StudentKitPro Guide</div>
            <div className="flex items-center gap-1.5 text-xs text-ok">
              <span className="size-1.5 rounded-full bg-ok" />
              Online
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {msgs.map((m) => (
            <div key={m.id} className={cn("rise flex items-end gap-2.5", m.from === "me" && "flex-row-reverse")}>
              {m.from === "bot" ? <LogoMark size={28} /> : <Avatar name={session?.name ?? "Me"} size={28} />}
              <div
                className={cn(
                  "max-w-[min(560px,85%)] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  m.from === "bot" ? "rounded-bl-md bg-subtle text-ink" : "rounded-br-md bg-ink text-white",
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="fade-in flex items-end gap-2.5">
              <LogoMark size={28} />
              <div className="flex gap-1 rounded-2xl rounded-bl-md bg-subtle px-4 py-4">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="typing-dot size-1.5 rounded-full bg-ink-2" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-line px-4 py-4 sm:px-5">
          <div className="no-scrollbar mb-3 flex gap-2 overflow-x-auto">
            {BOT_SCRIPTS.map((s, i) => (
              <button
                key={s.q}
                onClick={() => ask(s.q)}
                disabled={typing}
                className="pop-in shrink-0 rounded-full border border-line bg-surface px-3.5 py-2 text-[13px] text-ink-2 transition-colors hover:border-accent hover:text-accent-strong disabled:opacity-50"
                style={{ ["--i" as string]: i * 4 }}
              >
                {s.q}
              </button>
            ))}
          </div>
          <form onSubmit={onSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question"
              className="h-11 flex-1 rounded-xl border border-line bg-subtle px-4 text-sm outline-none transition-[border-color,background-color] focus:border-accent focus:bg-white"
            />
            <button type="submit" disabled={!input.trim() || typing} aria-label="Send" className="grid size-11 place-items-center rounded-xl bg-accent-strong text-white transition-colors hover:bg-[#a93c16] disabled:opacity-40">
              <Icon name="send" size={18} />
            </button>
          </form>
        </div>
      </Card>
    </>
  );
}
