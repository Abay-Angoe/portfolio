import { RESUME } from "@/content/resume";

/**
 * The résumé rendered as a printable "paper" document. Intentionally always
 * light (it's a document), with no hooks, so it works both inside the Preview
 * app window and as a server-rendered page at /resume (which is printed to PDF).
 */
export default function ResumeDocument() {
  const r = RESUME;
  return (
    <article className="mx-auto max-w-[720px] bg-white px-10 py-9 text-neutral-800">
      <header className="border-b border-neutral-200 pb-4">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">{r.name}</h1>
        <p className="mt-1 text-lg text-neutral-600">{r.title}</p>
        <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-neutral-500">
          <span>{r.location}</span>
          <span aria-hidden>·</span>
          <span>{r.email}</span>
          <span aria-hidden>·</span>
          <span>{r.website}</span>
        </p>
      </header>

      <Section title="Summary">
        <p className="text-[14px] leading-relaxed text-neutral-700">{r.summary}</p>
      </Section>

      <Section title="Experience">
        <div className="space-y-4">
          {r.experience.map((job, i) => (
            <div key={i}>
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-[15px] font-semibold text-neutral-900">
                  {job.role} · <span className="font-normal text-neutral-600">{job.company}</span>
                </h3>
                <span className="shrink-0 text-[12px] text-neutral-500">{job.period}</span>
              </div>
              <ul className="mt-1 list-disc space-y-0.5 pl-5 text-[13px] leading-relaxed text-neutral-700">
                {job.points.map((p, j) => (
                  <li key={j}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Education">
        <div className="space-y-2">
          {r.education.map((e, i) => (
            <div key={i} className="flex items-baseline justify-between gap-4">
              <h3 className="text-[14px] font-medium text-neutral-900">
                {e.school} · <span className="font-normal text-neutral-600">{e.detail}</span>
              </h3>
              <span className="shrink-0 text-[12px] text-neutral-500">{e.period}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Skills">
        <div className="flex flex-wrap gap-1.5">
          {r.skills.map((s) => (
            <span key={s} className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] text-neutral-700">
              {s}
            </span>
          ))}
        </div>
      </Section>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-widest text-neutral-400">
        {title}
      </h2>
      {children}
    </section>
  );
}
