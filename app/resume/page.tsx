import type { Metadata } from "next";
import ResumeDocument from "@/components/ResumeDocument";
import { RESUME } from "@/content/resume";

export const metadata: Metadata = {
  title: `${RESUME.name} — Résumé`,
  description: `Résumé of ${RESUME.name}, ${RESUME.title}.`,
};

// Standalone, printable résumé. Also the page rendered to /public/resume.pdf.
export default function ResumePage() {
  return (
    <main className="min-h-screen bg-neutral-100 py-8 print:bg-white print:py-0">
      <ResumeDocument />
    </main>
  );
}
