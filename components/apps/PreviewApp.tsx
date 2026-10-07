"use client";

import ResumeDocument from "@/components/ResumeDocument";

// Preview.app-style résumé viewer: a toolbar with download/open actions over a
// scrollable "paper" document. The PDF is generated from the /resume route.
export default function PreviewApp() {
  return (
    <div className="flex h-full w-full flex-col bg-sunken text-ink">
      <div className="flex items-center gap-2 border-b border-line bg-panel px-4 py-2">
        <a
          href="/resume.pdf"
          download
          style={{ backgroundColor: "var(--accent)" }}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium text-white transition hover:opacity-90"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14" />
          </svg>
          Download PDF
        </a>
        <a
          href="/resume"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-line px-3 py-1.5 text-[13px] transition hover:bg-[var(--hover)]"
        >
          Open in browser ↗
        </a>
        <span className="ml-auto text-[12px] text-dim">resume.pdf</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-[720px] overflow-hidden rounded-md shadow-xl shadow-black/20">
          <ResumeDocument />
        </div>
      </div>
    </div>
  );
}
