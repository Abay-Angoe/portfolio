"use client";

import { useState } from "react";
import Image from "next/image";
import { PROJECTS, type Project } from "@/content/projects";

function Thumb({ project, className }: { project: Project; className?: string }) {
  // A real screenshot (next/image) when provided; otherwise a CSS gradient
  // generated from the project's accent colors.
  if (project.image) {
    return (
      <div className={`relative overflow-hidden ${className ?? ""}`}>
        <Image
          src={project.image}
          alt={`${project.title} screenshot`}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
        />
      </div>
    );
  }
  const [from, to] = project.accent;
  return (
    <div
      className={`grid place-items-center text-white/90 ${className ?? ""}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <span className="px-4 text-center text-sm font-semibold drop-shadow">
        {project.title}
      </span>
    </div>
  );
}

function TechChips({ tech }: { tech: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tech.map((t) => (
        <span
          key={t}
          className="rounded-full bg-[var(--hover)] px-2 py-0.5 text-[11px] text-dim"
        >
          {t}
        </span>
      ))}
    </div>
  );
}

export default function ProjectsApp() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = PROJECTS.find((p) => p.id === selectedId) ?? null;

  if (selected) {
    return (
      <div className="h-full w-full overflow-y-auto bg-win">
        <div className="sticky top-0 z-10 border-b border-line bg-win px-4 py-2 backdrop-blur">
          <button
            type="button"
            onClick={() => setSelectedId(null)}
            style={{ color: "var(--accent)" }}
            className="rounded-md px-2 py-1 text-[13px] hover:bg-[var(--hover)]"
          >
            ‹ Projects
          </button>
        </div>
        <Thumb project={selected} className="h-48 w-full" />
        <div className="space-y-4 p-6 text-[13px]">
          <div>
            <h1 className="text-xl font-semibold text-ink">{selected.title}</h1>
            <p className="mt-1 text-dim">{selected.blurb}</p>
          </div>
          <p className="leading-relaxed text-dim">{selected.description}</p>
          <TechChips tech={selected.tech} />
          <div className="flex flex-wrap gap-2 pt-1">
            {selected.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--accent)" }}
                className="rounded-lg border border-line px-3 py-1.5 transition-colors hover:bg-[var(--hover)]"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto bg-sunken p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {PROJECTS.map((project) => (
          <button
            key={project.id}
            type="button"
            onClick={() => setSelectedId(project.id)}
            className="group overflow-hidden rounded-xl border border-line bg-win text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <Thumb project={project} className="h-28 w-full" />
            <div className="space-y-2 p-3 text-[13px]">
              <h2 className="font-semibold text-ink">{project.title}</h2>
              <p className="line-clamp-2 text-dim">{project.blurb}</p>
              <TechChips tech={project.tech.slice(0, 4)} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
