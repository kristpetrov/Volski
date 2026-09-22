import Link from "next/link";
import { Mark } from "@/components/mark";
import { ConsoleNav } from "@/components/console/nav";
import { focusRing } from "@/components/console/styles";
import { merchant } from "@/lib/demo-data";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(126,231,255,0.08),transparent_46%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(126,231,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(126,231,255,0.05)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />

      <div className="relative flex min-w-0 flex-1">
        <aside className="hidden w-60 shrink-0 flex-col border-r border-white/10 md:flex">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-5 ${focusRing} rounded-md`}
          >
            <Mark />
            <span className="font-mono text-xs tracking-[0.28em]">VOLSKI</span>
          </Link>
          <ConsoleNav orientation="vertical" />
          <div className="mt-auto border-t border-white/10 px-4 py-4">
            <p className="text-sm">{merchant.name}</p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-muted">
              {merchant.location.toUpperCase()} · {merchant.terminal}
            </p>
            <Link
              href="/"
              className={`mt-4 inline-block font-mono text-[10px] tracking-[0.16em] text-muted hover:text-foreground ${focusRing} rounded-sm`}
            >
              FRONT PAGE
            </Link>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-white/10 px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/dashboard"
                className={`md:hidden ${focusRing} rounded-md`}
                aria-label="Volski dashboard"
              >
                <Mark />
              </Link>
              <div className="min-w-0">
                <p className="truncate text-sm">{merchant.name}</p>
                <p className="truncate font-mono text-[10px] tracking-[0.16em] text-muted">
                  {merchant.location.toUpperCase()} · BATCH {merchant.batch}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-xs text-muted">
              <span className="inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.85)]" />
                {merchant.terminal}
              </span>
              <span className="hidden font-mono tracking-[0.14em] sm:inline">
                SETTLES {merchant.settlement}
              </span>
            </div>
          </header>
          <div className="overflow-x-auto border-b border-white/10 md:hidden">
            <ConsoleNav orientation="horizontal" />
          </div>
          <main className="min-h-0 flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}
