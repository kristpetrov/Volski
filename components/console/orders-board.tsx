"use client";

import { useState } from "react";
import Link from "next/link";
import { FilterBar } from "@/components/console/filter-bar";
import { Inspector, InspectorSlot } from "@/components/console/inspector";
import { focusRing } from "@/components/console/styles";
import { orderStatusLabel, orderTone } from "@/components/console/status";
import {
  ChargeSummary,
  EmptyLedger,
  Ledger,
  MetaList,
  StatusPill,
  ledgerRowClass,
} from "@/components/console/ui";
import {
  day,
  emailsForRelated,
  orderStateLine,
  orderTotal,
  orders,
  refundsForOrder,
  tenderLabel,
  whenLabel,
  type OrderStatus,
} from "@/lib/demo-data";
import { money } from "@/lib/money";

type Filter = "all" | OrderStatus;

export function OrdersBoard({ initialId }: { initialId: string | null }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    orders.some((order) => order.id === initialId) ? initialId : null,
  );

  const filtered = orders.filter((order) => {
    const haystack = [
      order.id,
      order.customerName,
      order.terminal,
      tenderLabel(order.tender),
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const matchesStatus = filter === "all" || order.status === filter;
    return matchesQuery && matchesStatus;
  });

  const selected = orders.find((order) => order.id === selectedId) ?? null;
  const close = () => setSelectedId(null);

  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      <div className="min-w-0 flex-1 px-4 py-6 sm:px-6">
        <header className="mb-6">
          <p className="font-mono text-[11px] tracking-[0.28em] text-accent">
            LEDGER
          </p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight">Orders</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Tickets from the registers. Open one to see the lines, tender, and
            auth code. Showing {orders.length} of {day.captures} from the
            sample day.
          </p>
        </header>
        <FilterBar
          label="Order status"
          query={query}
          onQuery={setQuery}
          placeholder="Search tickets"
          value={filter}
          onChange={setFilter}
          filters={[
            { id: "all", label: `All · ${orders.length}` },
            {
              id: "open",
              label: `Open · ${orders.filter((order) => order.status === "open").length}`,
            },
            {
              id: "authorized",
              label: `Authorized · ${orders.filter((order) => order.status === "authorized").length}`,
            },
            {
              id: "captured",
              label: `Captured · ${orders.filter((order) => order.status === "captured").length}`,
            },
            {
              id: "voided",
              label: `Voided · ${orders.filter((order) => order.status === "voided").length}`,
            },
          ]}
        />
        <div className="mt-4">
          <Ledger
            columns={[
              { label: "Ticket" },
              { label: "When" },
              { label: "Customer" },
              { label: "Tender" },
              { label: "Terminal" },
              { label: "Amount", align: "right" },
              { label: "Status" },
            ]}
          >
            {filtered.length === 0 ? (
              <EmptyLedger colSpan={7}>No tickets match.</EmptyLedger>
            ) : (
              filtered.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedId(order.id)}
                  className={`cursor-pointer ${ledgerRowClass(order.id === selectedId)}`}
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      aria-pressed={order.id === selectedId}
                      onClick={() => setSelectedId(order.id)}
                      className={`font-mono text-[13px] text-accent ${focusRing} rounded-sm`}
                    >
                      {order.id}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {whenLabel(order.day, order.at)}
                  </td>
                  <td className="px-4 py-3">{order.customerName}</td>
                  <td className="px-4 py-3 text-muted">
                    {tenderLabel(order.tender)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {order.terminal}
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
              ))
            )}
          </Ledger>
        </div>
      </div>
      <InspectorSlot
        open={selected !== null}
        onClose={close}
        empty="Select a ticket to see lines, tender, and the auth code."
      >
        {selected ? (
          <OrderInspector
            orderId={selected.id}
            onClose={close}
          />
        ) : null}
      </InspectorSlot>
    </div>
  );
}

function OrderInspector({
  orderId,
  onClose,
}: {
  orderId: string;
  onClose: () => void;
}) {
  const order = orders.find((item) => item.id === orderId);
  if (!order) return null;
  const relatedRefunds = refundsForOrder(order.id);
  const relatedMail = emailsForRelated("order", order.id);

  return (
    <Inspector kicker="TICKET" title={order.id} onClose={onClose}>
      <div className="flex items-end justify-between gap-3">
        <p className="text-3xl font-medium tabular-nums tracking-tight">
          {money(orderTotal(order))}
        </p>
        <StatusPill tone={orderTone[order.status]}>
          {orderStatusLabel[order.status]}
        </StatusPill>
      </div>
      <p className="text-sm leading-6 text-muted">{orderStateLine(order)}</p>
      <ChargeSummary order={order} />
      <MetaList
        items={[
          { label: "When", value: whenLabel(order.day, order.at) },
          { label: "Terminal", value: order.terminal },
          { label: "Tender", value: tenderLabel(order.tender) },
          { label: "Auth", value: order.authCode ?? "—" },
        ]}
      />
      {order.note ? (
        <p className="text-sm leading-6 text-muted">{order.note}</p>
      ) : null}
      {order.customerId ? (
        <Link
          href={`/dashboard/customers?id=${order.customerId}`}
          className={`text-sm text-accent ${focusRing} rounded-sm`}
        >
          {order.customerName}
        </Link>
      ) : (
        <p className="text-sm text-muted">No customer on this ticket.</p>
      )}
      {relatedRefunds.length > 0 ? (
        <div>
          <h3 className="font-mono text-[10px] tracking-[0.16em] text-muted">
            REFUNDS
          </h3>
          <ul className="mt-2 space-y-2">
            {relatedRefunds.map((refund) => (
              <li key={refund.id}>
                <Link
                  href={`/dashboard/refunds?id=${refund.id}`}
                  className={`text-sm text-accent ${focusRing} rounded-sm`}
                >
                  {refund.id} · {money(refund.cents)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {relatedMail.length > 0 ? (
        <div>
          <h3 className="font-mono text-[10px] tracking-[0.16em] text-muted">
            MAIL
          </h3>
          <ul className="mt-2 space-y-2">
            {relatedMail.map((email) => (
              <li key={email.id}>
                <Link
                  href={`/dashboard/emails?id=${email.id}`}
                  className={`text-sm text-accent ${focusRing} rounded-sm`}
                >
                  {email.subject}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Inspector>
  );
}
