import Link from "next/link";
import { panel, focusRing } from "@/components/console/styles";
import { Ledger, StatusPill } from "@/components/console/ui";
import {
  day,
  emails,
  merchant,
  orders,
  orderTotal,
  refunds,
  tenderLabel,
  volume,
  whenLabel,
} from "@/lib/demo-data";
import { money } from "@/lib/money";
import { orderTone, orderStatusLabel } from "@/components/console/status";

const peak = Math.max(...volume.map((slot) => slot.cents));

export function Overview() {
  const openTicket = orders.find((order) => order.status === "open");
  const authHold = orders.find((order) => order.status === "authorized");
  const review = refunds.find((refund) => refund.status === "review");
  const bounced = emails.find((email) => email.status === "bounced");
  const latest = orders.slice(0, 6);

  const attention = [
    openTicket
      ? {
          href: `/dashboard/orders?id=${openTicket.id}`,
          label: "Open ticket",
          detail: `${openTicket.terminal} · ${openTicket.lines.map((line) => line.name).join(", ")}`,
          meta: money(orderTotal(openTicket)),
        }
      : null,
    review
      ? {
          href: `/dashboard/refunds?id=${review.id}`,
          label: "Refund in review",
          detail: `${review.customerName} · ${review.reason}`,
          meta: money(review.cents),
        }
      : null,
    bounced
      ? {
          href: `/dashboard/emails?id=${bounced.id}`,
          label: "Receipt bounced",
          detail: bounced.to,
          meta: bounced.relatedId,
        }
      : null,
  ].filter((item) => item !== null);

  return (
    <div className="px-4 py-6 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.28em] text-accent">
            OPERATING DAY
          </p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight sm:text-3xl">
            {merchant.name}
          </h1>
        </div>
        <p className="max-w-sm text-sm leading-6 text-muted">
          Downtown register. Captures, holds, refunds, and receipt mail for
          this sample day.
        </p>
      </header>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          href="/dashboard/orders"
          label="Captured"
          value={money(day.capturedCents)}
          detail={`${day.captures} tickets`}
        />
        <Stat
          href="/dashboard/orders?id=TKT-18422"
          label="Open auths"
          value={money(day.authorizedCents)}
          detail={`${day.openAuths} hold on ${merchant.terminal}`}
        />
        <Stat
          href="/dashboard/refunds"
          label="Refunds"
          value={money(day.refundCents)}
          detail={`${day.refundsInReview} waiting on review`}
        />
        <Stat
          href="/dashboard/emails?id=EML-90390"
          label="Receipt mail"
          value={String(day.emailsSent)}
          detail={`${day.bounced} bounced`}
        />
      </section>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
        <section className={`${panel} p-5`}>
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-medium">Captured volume</h2>
            <p className="font-mono text-[10px] tracking-[0.16em] text-muted">
              BY HOUR
            </p>
          </div>
          <div
            className="mt-6 flex items-end gap-2"
            role="img"
            aria-label="Captured volume by hour, highest at 12"
          >
            {volume.map((slot) => (
              <div key={slot.hour} className="flex flex-1 flex-col gap-2">
                <div className="flex h-32 items-end">
                  <div
                    className="w-full rounded-sm bg-accent/80 shadow-[0_0_18px_rgba(126,231,255,0.18)]"
                    style={{
                      height: `${Math.max(8, (slot.cents / peak) * 100)}%`,
                    }}
                    title={`${slot.hour}:00 ${money(slot.cents)}`}
                  />
                </div>
                <span className="text-center font-mono text-[10px] text-muted">
                  {slot.hour}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid gap-4">
          {openTicket ? (
            <section className={`${panel} p-5`}>
              <p className="font-mono text-[10px] tracking-[0.2em] text-muted">
                REGISTER {openTicket.terminal}
              </p>
              <p className="mt-3 text-sm text-muted">Open ticket</p>
              <p className="mt-1 text-3xl font-medium tabular-nums tracking-tight">
                {money(orderTotal(openTicket))}
              </p>
              <ul className="mt-4 space-y-1 text-sm text-muted">
                {openTicket.lines.map((line) => (
                  <li key={line.name}>
                    {line.qty} × {line.name}
                  </li>
                ))}
              </ul>
              {authHold ? (
                <Link
                  href={`/dashboard/orders?id=${authHold.id}`}
                  className={`mt-4 flex items-center justify-between gap-3 border-t border-white/10 pt-3 text-sm ${focusRing} rounded-sm`}
                >
                  <span className="text-muted">
                    Auth hold · {authHold.customerName}
                  </span>
                  <span className="tabular-nums">
                    {money(orderTotal(authHold))}
                  </span>
                </Link>
              ) : null}
              <Link
                href={`/dashboard/orders?id=${openTicket.id}`}
                className={`mt-3 inline-block text-sm text-accent ${focusRing} rounded-sm`}
              >
                Inspect ticket
              </Link>
            </section>
          ) : null}

          <section className={`${panel} p-5`}>
            <p className="font-mono text-[10px] tracking-[0.2em] text-accent">
              VOLSKI PAY
            </p>
            <h2 className="mt-3 text-lg font-medium">Batch {merchant.batch}</h2>
            <p className="mt-1 text-sm text-muted">
              Open · settles {merchant.settlement}
            </p>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Captures</dt>
                <dd className="tabular-nums">{day.captures}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Gross</dt>
                <dd className="tabular-nums">{money(day.capturedCents)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Refunds</dt>
                <dd className="tabular-nums">{money(day.refundCents)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Declines</dt>
                <dd className="tabular-nums">{day.declines}</dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-white/10 pt-3">
                <dt>Net</dt>
                <dd className="tabular-nums">
                  {money(day.capturedCents - day.refundCents)}
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>

      <section className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
        <div>
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <h2 className="text-sm font-medium">Latest tickets</h2>
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted">
              {latest.length} OF {day.captures}
            </p>
          </div>
          <Ledger
            columns={[
              { label: "Ticket" },
              { label: "When" },
              { label: "Customer" },
              { label: "Tender" },
              { label: "Amount", align: "right" },
              { label: "Status" },
            ]}
          >
            {latest.map((order) => (
              <tr key={order.id} className="border-t border-white/8">
                <td className="px-4 py-3">
                  <Link
                    href={`/dashboard/orders?id=${order.id}`}
                    className={`font-mono text-[13px] text-accent ${focusRing} rounded-sm`}
                  >
                    {order.id}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted">
                  {whenLabel(order.day, order.at)}
                </td>
                <td className="px-4 py-3">{order.customerName}</td>
                <td className="px-4 py-3 text-muted">
                  {tenderLabel(order.tender)}
                </td>
                <td
                  className={`px-4 py-3 text-right tabular-nums ${order.status === "voided" ? "text-muted line-through" : ""}`}
                >
                  {money(orderTotal(order))}
                </td>
                <td className="px-4 py-3">
                  <StatusPill tone={orderTone[order.status]}>
                    {orderStatusLabel[order.status]}
                  </StatusPill>
                </td>
              </tr>
            ))}
          </Ledger>
        </div>

        <section className={`${panel} p-5`}>
          <h2 className="text-sm font-medium">Needs a look</h2>
          <ul className="mt-4 space-y-2">
            {attention.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center justify-between gap-3 rounded-xl border border-white/10 px-3 py-3 hover:border-accent/30 ${focusRing}`}
                >
                  <span className="min-w-0">
                    <span className="block text-sm">{item.label}</span>
                    <span className="mt-1 block truncate text-xs text-muted">
                      {item.detail}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-xs text-accent">
                    {item.meta}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </div>
  );
}

function Stat({
  href,
  label,
  value,
  detail,
}: {
  href: string;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Link
      href={href}
      className={`${panel} p-5 transition-colors hover:border-accent/30 ${focusRing}`}
    >
      <p className="font-mono text-[10px] tracking-[0.2em] text-muted">
        {label.toUpperCase()}
      </p>
      <p className="mt-3 text-3xl font-medium tracking-tight tabular-nums">
        {value}
      </p>
      <p className="mt-2 text-sm text-muted">{detail}</p>
    </Link>
  );
}
