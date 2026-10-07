import type { AppId } from "@/lib/types";

/**
 * Move keyboard focus to an app's dock button. Used when a window closes so
 * focus returns to the control that opened it, per the a11y brief (§7).
 */
export function focusDockItem(appId: AppId) {
  if (typeof document === "undefined") return;
  const el = document.querySelector<HTMLElement>(`[data-dock-app="${appId}"]`);
  el?.focus();
}
