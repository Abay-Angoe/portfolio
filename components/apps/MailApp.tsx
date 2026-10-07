"use client";

import { useMemo, useState } from "react";
import { CONTACT } from "@/content/contact";

type Status = "idle" | "sending" | "sent" | "opening" | "error";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex items-center gap-3 border-b border-line px-4 py-2 text-[13px]">
      <span className="w-16 shrink-0 text-faint">{label}</span>
      {children}
    </label>
  );
}

export default function MailApp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const canSend = emailOk && message.trim().length > 0 && status !== "sending";

  const mailtoHref = useMemo(() => {
    const subj = subject || `Portfolio message${name ? ` from ${name}` : ""}`;
    const body = `${message}\n\n— ${name || "Anonymous"}${email ? ` (${email})` : ""}`;
    return `mailto:${CONTACT.to}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
  }, [subject, name, message, email]);

  async function send() {
    if (!canSend) return;
    setError("");
    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID;

    if (formspreeId) {
      setStatus("sending");
      try {
        const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ name, email, subject, message }),
        });
        if (!res.ok) throw new Error(`status ${res.status}`);
        setStatus("sent");
      } catch (e) {
        setStatus("error");
        setError(e instanceof Error ? e.message : "Failed to send");
      }
      return;
    }

    // No form backend configured — hand off to the visitor's mail client.
    setStatus("opening");
    window.location.href = mailtoHref;
  }

  function reset() {
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setStatus("idle");
    setError("");
  }

  if (status === "sent") {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-win p-8 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-full bg-green-500 text-white">
          <svg viewBox="0 0 24 24" className="h-7 w-7 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-ink">Message sent</h2>
        <p className="text-[13px] text-dim">Thanks — I&apos;ll get back to you.</p>
        <button
          type="button"
          onClick={reset}
          style={{ backgroundColor: "var(--accent)" }}
          className="mt-2 rounded-lg px-4 py-1.5 text-[13px] font-medium text-white hover:opacity-90"
        >
          New Message
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-win text-ink">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-line bg-panel px-4 py-2">
        <button
          type="button"
          onClick={send}
          disabled={!canSend}
          style={{ backgroundColor: "var(--accent)" }}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[13px] font-medium text-white transition enabled:hover:opacity-90 disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
          {status === "sending" ? "Sending…" : "Send"}
        </button>
        <span className="text-[13px] text-faint">{CONTACT.blurb}</span>
      </div>

      {/* Address fields */}
      <Field label="To:">
        <span
          style={{ color: "var(--accent)" }}
          className="rounded bg-[var(--hover)] px-2 py-0.5 text-[12px]"
        >
          {CONTACT.to}
        </span>
      </Field>
      <Field label="Name:">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="flex-1 bg-transparent outline-none placeholder:text-faint"
        />
      </Field>
      <Field label="From:">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 bg-transparent outline-none placeholder:text-faint"
        />
      </Field>
      <Field label="Subject:">
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="flex-1 bg-transparent outline-none placeholder:text-faint"
        />
      </Field>

      {/* Body */}
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message…"
        className="min-h-0 flex-1 resize-none px-4 py-3 text-[14px] leading-relaxed outline-none placeholder:text-faint"
      />

      {(status === "opening" || status === "error") && (
        <p
          className={`border-t border-line px-4 py-2 text-[12px] ${
            status === "error" ? "text-red-500" : "text-dim"
          }`}
        >
          {status === "opening" ? "Opening your mail app…" : `Couldn't send: ${error}`}
        </p>
      )}
    </div>
  );
}
