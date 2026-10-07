"use client";

import { useMemo, useState } from "react";
import { NOTES, type Note } from "@/content/notes";

function formatDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** First non-heading line, used as the list preview. */
function preview(body: string): string {
  const line = body
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith("#"));
  return line ?? "No additional text";
}

/** Render plain-text body: "# " lines become headings, blank lines split paragraphs. */
function NoteBody({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/);
  return (
    <div className="space-y-3">
      {blocks.map((block, i) => {
        if (block.startsWith("# ")) {
          return (
            <h1 key={i} className="text-lg font-semibold text-ink">
              {block.slice(2)}
            </h1>
          );
        }
        return (
          <p key={i} className="whitespace-pre-wrap leading-relaxed text-dim">
            {block}
          </p>
        );
      })}
    </div>
  );
}

export default function NotesApp() {
  // Pinned notes first, then most-recently updated.
  const ordered = useMemo(
    () =>
      [...NOTES].sort((a, b) => {
        if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
        return a.updated < b.updated ? 1 : -1;
      }),
    [],
  );
  const [activeId, setActiveId] = useState(ordered[0]?.id);
  const active: Note | undefined =
    ordered.find((n) => n.id === activeId) ?? ordered[0];

  return (
    <div className="flex h-full w-full text-[13px]">
      {/* Note list */}
      <aside className="w-56 shrink-0 overflow-y-auto border-r border-line bg-panel">
        <ul>
          {ordered.map((note) => (
            <li key={note.id}>
              <button
                type="button"
                onClick={() => setActiveId(note.id)}
                aria-current={note.id === active?.id ? "true" : undefined}
                className={`block w-full border-b border-line px-3 py-2 text-left transition-colors ${
                  note.id === active?.id
                    ? "bg-amber-200/70 dark:bg-amber-400/20"
                    : "hover:bg-[var(--hover)]"
                }`}
              >
                <div className="flex items-center gap-1">
                  {note.pinned && <span className="text-[10px]">📌</span>}
                  <span className="truncate font-semibold text-ink">
                    {note.title}
                  </span>
                </div>
                <div className="mt-0.5 flex gap-2 text-[11px] text-dim">
                  <span className="shrink-0">{formatDate(note.updated)}</span>
                  <span className="truncate">{preview(note.body)}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Note body */}
      <main className="flex-1 overflow-y-auto bg-win px-6 py-5">
        {active ? (
          <>
            <p className="mb-4 text-center text-[11px] text-faint">
              {formatDate(active.updated)}
            </p>
            <NoteBody body={active.body} />
          </>
        ) : (
          <p className="text-faint">No notes.</p>
        )}
      </main>
    </div>
  );
}
