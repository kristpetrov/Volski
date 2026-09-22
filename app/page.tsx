import Link from "next/link";
import { Mark } from "@/components/mark";

const features = [
  {
    label: "01",
    title: "Register",
    text: "Ring up items and take payment without leaving the counter.",
  },
  {
    label: "02",
    title: "Orders",
    text: "Keep every ticket clear from the first item to the close.",
  },
  {
    label: "03",
    title: "Closeout",
    text: "See the day’s sales in one place when the shift ends.",
  },
];

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(126,231,255,0.14),transparent_52%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(126,231,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(126,231,255,0.06)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)]" />

      <header className="relative z-10 mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <Mark />
          <span className="font-mono text-xs tracking-[0.28em] text-foreground">
            VOLSKI
          </span>
        </div>
        <span className="font-mono text-[11px] tracking-[0.22em] text-muted">
          POS
        </span>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 pb-16 pt-10">
        <p className="font-mono text-[11px] tracking-[0.32em] text-accent">
          POINT OF SALE
        </p>
        <h1 className="mt-4 max-w-xl text-5xl font-medium tracking-tight text-foreground sm:text-6xl">
          The counter, simplified.
        </h1>
        <p className="mt-5 max-w-md text-lg leading-8 text-muted">
          Volski is a point-of-sale system for taking orders, collecting
          payment, and closing out the day.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center rounded-full border border-accent/40 bg-accent/10 px-5 text-sm text-accent transition-colors hover:bg-accent/20"
          >
            Open dashboard
          </Link>
          <span className="font-mono text-[11px] tracking-[0.18em] text-muted">
            DESIGN CONCEPT
          </span>
        </div>

        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.title} className="bg-[#0b0e14] px-6 py-7">
              <p className="font-mono text-[11px] tracking-[0.22em] text-accent/80">
                {feature.label}
              </p>
              <h2 className="mt-4 text-lg font-medium tracking-tight">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">{feature.text}</p>
            </li>
          ))}
        </ul>
      </main>

      <footer className="relative z-10 mx-auto w-full max-w-5xl px-6 py-6 font-mono text-[11px] tracking-[0.18em] text-muted">
        VOLSKI POS
      </footer>
    </div>
  );
}
