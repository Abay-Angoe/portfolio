"use client";

// Shown briefly while a lazily-loaded app body's chunk is fetched.
export default function AppFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-win">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-line border-t-dim" />
    </div>
  );
}
