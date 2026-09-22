"use client";

import { useEffect } from "react";
import { focusRing } from "@/components/console/styles";

export function InspectorSlot({
  open,
  onClose,
  empty,
  children,
}: {
  open: boolean;
  onClose: () => void;
  empty: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) {
    return (
      <aside className="hidden border-white/10 px-6 py-6 lg:sticky lg:top-0 lg:block lg:max-h-[calc(100dvh-3.5rem)] lg:w-[380px] lg:shrink-0 lg:overflow-auto lg:border-l">
        <p className="font-mono text-[11px] tracking-[0.18em] text-muted">
          INSPECT
        </p>
        <p className="mt-3 max-w-xs text-sm leading-6 text-muted">{empty}</p>
      </aside>
    );
  }

  return (
    <aside className="fixed inset-0 z-30 overflow-auto bg-background lg:sticky lg:inset-auto lg:top-0 lg:z-auto lg:block lg:max-h-[calc(100dvh-3.5rem)] lg:w-[380px] lg:shrink-0 lg:border-l lg:border-white/10 lg:bg-[#0b0e14]">
      {children}
    </aside>
  );
}

export function Inspector({
  kicker,
  title,
  onClose,
  children,
}: {
  kicker: string;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex items-start justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div className="min-w-0">
          <p className="font-mono text-[11px] tracking-[0.22em] text-accent">
            {kicker}
          </p>
          <h2 className="mt-1 truncate text-lg font-medium tracking-tight">
            {title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={`shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-muted hover:text-foreground ${focusRing}`}
        >
          Close
        </button>
      </div>
      <div className="flex flex-col gap-5 px-5 py-5">{children}</div>
    </>
  );
}
