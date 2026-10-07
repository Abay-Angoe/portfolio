"use client";

import { useEffect, useState } from "react";

/** macOS-style menu-bar clock, e.g. "Thu 24 Jul 14:32". */
function format(date: Date): string {
  return date.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function Clock() {
  // Start null so server and first client render match (no hydration mismatch);
  // the real time is filled in after mount.
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    // Tick every 10s so the minute rolls over promptly without a per-second churn.
    const id = setInterval(() => setNow(new Date()), 10_000);
    return () => clearInterval(id);
  }, []);

  return (
    <span suppressHydrationWarning className="tabular-nums">
      {now ? format(now) : ""}
    </span>
  );
}
