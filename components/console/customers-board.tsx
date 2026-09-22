"use client";

import { useState } from "react";
import Link from "next/link";
import { FilterBar } from "@/components/console/filter-bar";
import { Inspector, InspectorSlot } from "@/components/console/inspector";
import { focusRing } from "@/components/console/styles";
import { orderStatusLabel, orderTone } from "@/components/console/status";
import {
  EmptyLedger,
  Ledger,
  StatusPill,
  ledgerRowClass,
} from "@/components/console/ui";
import {
  customers,
  ordersForCustomer,
  orderTotal,
  tenderLabel,
  whenLabel,
  type Customer,
} from "@/lib/demo-data";
import { money } from "@/lib/money";

type Filter = "all" | "card" | "cash";

export function CustomersBoard({ initialId }: { initialId: string | null }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    customers.some((customer) => customer.id === initialId) ? initialId : null,
  );

  const filtered = customers.filter((customer) => {
    const haystack = [customer.name, customer.email, customer.id]
      .join(" ")
      .toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const matchesTender =
      filter === "all" ||
      (filter === "cash"
        ? customer.tender.brand === "Cash"
        : customer.tender.brand !== "Cash");
    return matchesQuery && matchesTender;
  });

  const selected =
    customers.find((customer) => customer.id === selectedId) ?? null;
  const close = () => setSelectedId(null);

  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      <div className="min-w-0 flex-1 px-4 py-6 sm:px-6">
        <header className="mb-6">
          <p className="font-mono text-[11px] tracking-[0.28em] text-accent">
            PROFILES
          </p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight">
            Customers
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            People who paid at Northline Market. A card on file is the brand
            and last four only.
          </p>
        </header>
        <FilterBar
          label="Tender on file"
          query={query}
          onQuery={setQuery}
          placeholder="Search customers"
          value={filter}
          onChange={setFilter}
          filters={[
            { id: "all", label: `All · ${customers.length}` },
            {
              id: "card",
              label: `Card · ${customers.filter((customer) => customer.tender.brand !== "Cash").length}`,
            },
            {
              id: "cash",
              label: `Cash · ${customers.filter((customer) => customer.tender.brand === "Cash").length}`,
            },
          ]}
        />
        <div className="mt-4">
          <Ledger
            columns={[
              { label: "Customer" },
              { label: "Email" },
              { label: "Visits", align: "right" },
              { label: "On file" },
              { label: "Lifetime", align: "right" },
            ]}
          >
            {filtered.length === 0 ? (
              <EmptyLedger colSpan={5}>No customers match.</EmptyLedger>
            ) : (
              filtered.map((customer) => {
                const latest = ordersForCustomer(customer.id)[0];
                return (
                  <tr
                    key={customer.id}
                    onClick={() => setSelectedId(customer.id)}
                    className={`cursor-pointer ${ledgerRowClass(customer.id === selectedId)}`}
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        aria-pressed={customer.id === selectedId}
                        onClick={() => setSelectedId(customer.id)}
                        className={`text-left ${focusRing} rounded-sm`}
                      >
                        <span className="block">{customer.name}</span>
                        <span className="mt-1 block font-mono text-[11px] text-muted">
                          {customer.id}
                          {latest
                            ? ` · ${whenLabel(latest.day, latest.at)}`
                            : ""}
                        </span>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-muted">{customer.email}</td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {customer.visits}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {tenderLabel(customer.tender)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">
                      {money(customer.lifetimeCents)}
                    </td>
                  </tr>
                );
              })
            )}
          </Ledger>
        </div>
      </div>
      <InspectorSlot
        open={selected !== null}
        onClose={close}
        empty="Select a customer to see the card on file and tickets in this ledger."
      >
        {selected ? (
          <CustomerInspector customer={selected} onClose={close} />
        ) : null}
      </InspectorSlot>
    </div>
  );
}

function CustomerInspector({
  customer,
  onClose,
}: {
  customer: Customer;
  onClose: () => void;
}) {
  const tickets = ordersForCustomer(customer.id);
  const card = customer.tender.brand !== "Cash";

  return (
    <Inspector kicker="CUSTOMER" title={customer.name} onClose={onClose}>
      <p className="text-3xl font-medium tabular-nums tracking-tight">
        {money(customer.lifetimeCents)}
      </p>
      <p className="text-sm text-muted">
        Lifetime · {customer.visits} visits since {customer.since}
      </p>
      {card ? (
        <div className="rounded-xl border border-accent/25 bg-gradient-to-br from-accent/15 to-transparent p-4">
          <p className="font-mono text-[10px] tracking-[0.22em] text-accent">
            {customer.tender.brand.toUpperCase()}
          </p>
          <p className="mt-6 font-mono text-lg tracking-[0.18em]">
            •••• {customer.tender.last4}
          </p>
          <p className="mt-2 text-xs text-muted">
            {customer.tender.entry} · Northline Market
          </p>
        </div>
      ) : (
        <p className="rounded-xl border border-white/10 px-4 py-4 text-sm text-muted">
          No card on file. This customer pays cash.
        </p>
      )}
      <dl className="space-y-3 text-sm">
        <div>
          <dt className="font-mono text-[10px] tracking-[0.16em] text-muted">
            EMAIL
          </dt>
          <dd className="mt-1">{customer.email}</dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] tracking-[0.16em] text-muted">
            PHONE
          </dt>
          <dd className="mt-1">{customer.phone}</dd>
        </div>
      </dl>
      {customer.note ? (
        <p className="text-sm leading-6 text-muted">{customer.note}</p>
      ) : null}
      <div>
        <h3 className="font-mono text-[10px] tracking-[0.16em] text-muted">
          TICKETS IN THIS LEDGER
        </h3>
        {tickets.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No tickets in this ledger.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {tickets.map((order) => (
              <li key={order.id} className="flex items-center justify-between gap-3">
                <Link
                  href={`/dashboard/orders?id=${order.id}`}
                  className={`font-mono text-[13px] text-accent ${focusRing} rounded-sm`}
                >
                  {order.id}
                </Link>
                <span className="flex items-center gap-2">
                  <span className="tabular-nums text-sm">
                    {money(orderTotal(order))}
                  </span>
                  <StatusPill tone={orderTone[order.status]}>
                    {orderStatusLabel[order.status]}
                  </StatusPill>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Inspector>
  );
}
