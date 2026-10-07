"use client";

import { AnimatePresence } from "framer-motion";
import Window from "@/components/Window";
import { useDesktopStore } from "@/lib/store";

/**
 * Renders open windows. On desktop every non-minimized window is shown; on
 * mobile only the focused (top-most) one is, full-screen. Minimized/closed
 * windows leave the tree so AnimatePresence plays their exit transition.
 */
export default function WindowLayer({ mobile = false }: { mobile?: boolean }) {
  const windows = useDesktopStore((s) => s.windows);

  const visible = windows.filter((w) => !w.isMinimized);
  const shown = mobile
    ? visible.length
      ? [visible.reduce((a, b) => (b.zIndex > a.zIndex ? b : a))]
      : []
    : visible;

  return (
    <div className="pointer-events-none absolute inset-0">
      <AnimatePresence>
        {shown.map((w) => (
          <Window key={w.id} win={w} mobile={mobile} />
        ))}
      </AnimatePresence>
    </div>
  );
}
