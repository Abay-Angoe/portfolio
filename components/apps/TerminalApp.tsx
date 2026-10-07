"use client";

import { useEffect, useRef, useState } from "react";
import { TERMINAL } from "@/content/terminal";
import { APPS } from "@/lib/apps";
import { useDesktopStore } from "@/lib/store";

const PROMPT = "guest@portfolio ~ %";

interface Line {
  kind: "in" | "out";
  text: string;
}

const banner: Line[] = TERMINAL.banner.map((text) => ({ kind: "out", text }));

export default function TerminalApp() {
  const [lines, setLines] = useState<Line[]>(banner);
  const [input, setInput] = useState("");
  const openApp = useDesktopStore((s) => s.openApp);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const history = useRef<string[]>([]);
  const cursor = useRef(0); // 0 = not browsing history

  // Keep the newest output in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  function run(raw: string) {
    const echo: Line = { kind: "in", text: raw };
    const out = (arr: string[]): Line[] => arr.map((text) => ({ kind: "out", text }));

    const cmd = raw.trim();
    if (!cmd) {
      setLines((l) => [...l, echo]);
      return;
    }
    history.current.push(cmd);
    cursor.current = 0;

    const [name, ...args] = cmd.split(/\s+/);
    let result: Line[] = [];

    switch (name) {
      case "help":
        result = out(TERMINAL.help);
        break;
      case "about":
        result = out(TERMINAL.about);
        break;
      case "whoami":
        result = out([TERMINAL.whoami]);
        break;
      case "contact":
        result = out(TERMINAL.contact);
        break;
      case "ls":
        result = out([Object.keys(TERMINAL.files).join("   ")]);
        break;
      case "cat": {
        const f = args[0];
        if (!f) result = out(["usage: cat <file>"]);
        else if (TERMINAL.files[f]) result = out(TERMINAL.files[f]);
        else result = out([`cat: ${f}: No such file or directory`]);
        break;
      }
      case "open": {
        const target = args[0];
        const app = APPS.find((a) => a.id === target);
        if (!target) result = out(["usage: open <app>"]);
        else if (app) {
          openApp(app.id); // dispatch to the window store
          result = out([`Opening ${app.name}…`]);
        } else {
          result = out([
            `open: ${target}: no such app.`,
            `try: ${APPS.map((a) => a.id).join(", ")}`,
          ]);
        }
        break;
      }
      case "clear":
        setLines([]);
        return;
      default:
        result = out([`command not found: ${name}. Type "help".`]);
    }

    setLines((l) => [...l, echo, ...result]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      run(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = history.current;
      if (h.length === 0) return;
      cursor.current = Math.min(cursor.current + 1, h.length);
      setInput(h[h.length - cursor.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = history.current;
      cursor.current = Math.max(cursor.current - 1, 0);
      setInput(cursor.current === 0 ? "" : h[h.length - cursor.current]);
    }
  }

  return (
    <div
      className="h-full w-full cursor-text overflow-y-auto bg-[#1b1b1f] p-3 font-mono text-[13px] leading-relaxed text-neutral-200"
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, i) =>
        line.kind === "in" ? (
          <div key={i} className="flex gap-2">
            <span className="shrink-0 text-emerald-400">{PROMPT}</span>
            <span className="whitespace-pre-wrap break-all text-neutral-100">
              {line.text}
            </span>
          </div>
        ) : (
          <div key={i} className="whitespace-pre-wrap break-words text-neutral-300">
            {line.text || " "}
          </div>
        ),
      )}

      {/* Active input line */}
      <div className="flex gap-2">
        <span className="shrink-0 text-emerald-400">{PROMPT}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label="Terminal input"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          className="flex-1 bg-transparent text-neutral-100 caret-emerald-400 outline-none"
        />
      </div>
    </div>
  );
}
