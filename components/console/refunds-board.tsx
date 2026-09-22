"use client";

import { useState } from "react";
import Link from "next/link";
import { FilterBar } from "@/components/console/filter-bar";
import { Inspector, InspectorSlot } from "@/components/console/inspector";
import { focusRing } from "@/components/console/styles";
import { refundStatusLabel, refundTone } from "@/components/console/status";
import {
  EmptyLedger,
  Ledger,
  MetaList,
  StatusPill,
  ledgerRowClass,
} from "@/components/console/ui";
import {
  day,
  findOrder,
  orderTotal,
  refunds,
  whenLabel,
  type Refund,
  type RefundStatus,
} from "@/lib/demo-data";
import { money } from "@/lib/money";

type Filter = "all" | RefundStatus;

export function RefundsBoard({ initialId }: { initialId: string | null }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    refunds.some((refund) => refund.id === initialId) ? initialId : null,
  );

  const filtered = refunds.filter((refund) => {
    const haystack = [
      refund.id,
      refund.customerName,
      refund.orderId,
      refund.reason,
    ]
      .join(" ")
      .toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const matchesStatus = filter === "all" || refund.status === filter;
    return matchesQuery && matchesStatus;
  });

  const selected = refunds.find((refund) => refund.id === selectedId) ?? null;
  const close = () => setSelectedId(null);

  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      <div className="min-w-0 flex-1 px-4 py-6 sm:px-6">
        <header className="mb-6">
          <p className="font-mono text-[11px] tracking-[0.28em] text-accent">
            RETURNS
          </p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight">Refunds</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Money sent back to the original tender. A review hold waits for a
            manager. Settled refunds on the sample day total{" "}
            {money(day.refundCents)}.
          </p>
        </header>
        <FilterBar
          label="Refund status"
          query={query}
          onQuery={setQuery}
          placeholder="Search refunds"
          value={filter}
          onChange={setFilter}
          filters={[
            { id: "all", label: `All · ${refunds.length}` },
            {
              id: "review",
              label: `Review · ${refunds.filter((refund) => refund.status === "review").length}`,
            },
            {
              id: "settled",
              label: `Settled · ${refunds.filter((refund) => refund.status === "settled").length}`,
            },
            {
              id: "declined",
              label: `Declined · ${refunds.filter((refund) => refund.status === "declined").length}`,
            },
          ]}
        />
        <div className="mt-4">
          <Ledger
            columns={[
              { label: "Refund" },
              { label: "When" },
              { label: "Customer" },
              { label: "Original" },
              { label: "Reason" },
              { label: "Amount", align: "right" },
              { label: "Status" },
            ]}
          >
            {filtered.length === 0 ? (
              <EmptyLedger colSpan={7}>No refunds match.</EmptyLedger>
            ) : (
              filtered.map((refund) => (
                <tr
                  key={refund.id}
                  onClick={() => setSelectedId(refund.id)}
                  className={`cursor-pointer ${ledgerRowClass(refund.id === selectedId)}`}
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      aria-pressed={refund.id === selectedId}
                      onClick={() => setSelectedId(refund.id)}
                      className={`font-mono text-[13px] text-accent ${focusRing} rounded-sm`}
                    >
                      {refund.id}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {whenLabel(refund.day, refund.at)}
                  </td>
                  <td className="px-4 py-3">{refund.customerName}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">
                    {refund.orderId}
                  </td>
                  <td className="px-4 py-3 text-muted">{refund.reason}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-rose-200">
                    −{money(refund.cents)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill tone={refundTone[refund.status]}>
                      {refundStatusLabel[refund.status]}
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
        empty="Select a refund to see the original sale and whether funds moved."
      >
        {selected ? (
          <RefundInspector refund={selected} onClose={close} />
        ) : null}
      </InspectorSlot>
    </div>
  );
}

function RefundInspector({
  refund,
  onClose,
}: {
  refund: Refund;
  onClose: () => void;
}) {
  const order = findOrder(refund.orderId);
  const steps = [
    { label: "Requested", state: "done" as const },
    {
      label: "Review",
      state: refund.status === "review" ? ("current" as const) : ("done" as const),
    },
    {
      label: refund.status === "declined" ? "Declined" : "Settled",
      state: refund.status === "review" ? ("wait" as const) : ("done" as const),
    },
  ];

  return (
    <Inspector kicker="REFUND" title={refund.id} onClose={onClose}>
      <div className="flex items-end justify-between gap-3">
        <p className="text-3xl font-medium tabular-nums tracking-tight text-rose-200">
          −{money(refund.cents)}
        </p>
        <StatusPill tone={refundTone[refund.status]}>
          {refundStatusLabel[refund.status]}
        </StatusPill>
      </div>
      <ol className="flex items-center gap-2">
        {steps.map((step, index) => (
          <li key={step.label} className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className={`size-2 shrink-0 rounded-full ${
                step.state === "wait"
                  ? "bg-white/20"
                  : step.label === "Declined"
                    ? "bg-rose-300"
                    : "bg-accent"
              }`}
            />
            <span className="truncate text-xs text-muted">{step.label}</span>
            {index < steps.length - 1 ? (
              <span className="h-px flex-1 bg-white/10" />
            ) : null}
          </li>
        ))}
      </ol>
      <p className="text-sm leading-6">{refund.reason}</p>
      <p className="text-sm leading-6 text-muted">{refund.response}</p>
      <MetaList
        items={[
          { label: "When", value: whenLabel(refund.day, refund.at) },
          { label: "By", value: refund.actor },
          { label: "Customer", value: refund.customerName },
          {
            label: "Original",
            value: order ? money(orderTotal(order)) : refund.orderId,
          },
        ]}
      />
      <div className="flex flex-col gap-2">
        <Link
          href={`/dashboard/orders?id=${refund.orderId}`}
          className={`text-sm text-accent ${focusRing} rounded-sm`}
        >
          Original ticket {refund.orderId}
        </Link>
        <Link
          href={`/dashboard/customers?id=${refund.customerId}`}
          className={`text-sm text-accent ${focusRing} rounded-sm`}
        >
          {refund.customerName}
        </Link>
      </div>
    </Inspector>
  );
}
