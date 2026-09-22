"use client";

import { useState } from "react";
import Link from "next/link";
import { FilterBar } from "@/components/console/filter-bar";
import { Inspector, InspectorSlot } from "@/components/console/inspector";
import { focusRing } from "@/components/console/styles";
import { emailStatusLabel, emailTone } from "@/components/console/status";
import {
  EmptyLedger,
  Ledger,
  Receipt,
  StatusPill,
  ledgerRowClass,
} from "@/components/console/ui";
import {
  day,
  emails,
  findOrder,
  findRefund,
  merchant,
  whenLabel,
  type Email,
  type EmailStatus,
} from "@/lib/demo-data";
import { money } from "@/lib/money";

type Filter = "all" | EmailStatus;

export function EmailsBoard({ initialId }: { initialId: string | null }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(
    emails.some((email) => email.id === initialId) ? initialId : null,
  );

  const filtered = emails.filter((email) => {
    const haystack = [email.id, email.to, email.subject, email.relatedId, email.kind]
      .join(" ")
      .toLowerCase();
    const matchesQuery = haystack.includes(query.trim().toLowerCase());
    const matchesStatus = filter === "all" || email.status === filter;
    return matchesQuery && matchesStatus;
  });

  const selected = emails.find((email) => email.id === selectedId) ?? null;
  const close = () => setSelectedId(null);

  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      <div className="min-w-0 flex-1 px-4 py-6 sm:px-6">
        <header className="mb-6">
          <p className="font-mono text-[11px] tracking-[0.28em] text-accent">
            MAIL
          </p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight">Emails</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Receipts and notices for this merchant. The sample day sent{" "}
            {day.emailsSent}. These {emails.length} are the ones worth opening.
            Nothing here leaves the screen.
          </p>
        </header>
        <FilterBar
          label="Delivery status"
          query={query}
          onQuery={setQuery}
          placeholder="Search mail"
          value={filter}
          onChange={setFilter}
          filters={[
            { id: "all", label: `All · ${emails.length}` },
            {
              id: "delivered",
              label: `Delivered · ${emails.filter((email) => email.status === "delivered").length}`,
            },
            {
              id: "opened",
              label: `Opened · ${emails.filter((email) => email.status === "opened").length}`,
            },
            {
              id: "queued",
              label: `Queued · ${emails.filter((email) => email.status === "queued").length}`,
            },
            {
              id: "bounced",
              label: `Bounced · ${emails.filter((email) => email.status === "bounced").length}`,
            },
          ]}
        />
        <div className="mt-4">
          <Ledger
            columns={[
              { label: "Mail" },
              { label: "When" },
              { label: "To" },
              { label: "Subject" },
              { label: "Status" },
            ]}
          >
            {filtered.length === 0 ? (
              <EmptyLedger colSpan={5}>No mail matches.</EmptyLedger>
            ) : (
              filtered.map((email) => (
                <tr
                  key={email.id}
                  onClick={() => setSelectedId(email.id)}
                  className={`cursor-pointer ${ledgerRowClass(email.id === selectedId)}`}
                >
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      aria-pressed={email.id === selectedId}
                      onClick={() => setSelectedId(email.id)}
                      className={`text-left ${focusRing} rounded-sm`}
                    >
                      <span className="block">{email.kind}</span>
                      <span className="mt-1 block font-mono text-[11px] text-muted">
                        {email.id}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {whenLabel(email.day, email.at)}
                  </td>
                  <td className="px-4 py-3 text-muted">{email.to}</td>
                  <td className="px-4 py-3">{email.subject}</td>
                  <td className="px-4 py-3">
                    <StatusPill tone={emailTone[email.status]}>
                      {emailStatusLabel[email.status]}
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
        empty="Select a message to read the receipt or notice."
      >
        {selected ? <EmailInspector email={selected} onClose={close} /> : null}
      </InspectorSlot>
    </div>
  );
}

function EmailInspector({
  email,
  onClose,
}: {
  email: Email;
  onClose: () => void;
}) {
  return (
    <Inspector kicker={email.kind.toUpperCase()} title={email.id} onClose={onClose}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm">{email.subject}</p>
          <p className="mt-1 text-sm text-muted">{email.to}</p>
        </div>
        <StatusPill tone={emailTone[email.status]}>
          {emailStatusLabel[email.status]}
        </StatusPill>
      </div>
      <p className="font-mono text-xs text-muted">{email.delivery}</p>
      <MailBody email={email} />
      <p className="text-xs leading-5 text-muted">
        {whenLabel(email.day, email.at)} · simulated send
      </p>
    </Inspector>
  );
}

function MailBody({ email }: { email: Email }) {
  if (email.relatedKind === "order") {
    const order = findOrder(email.relatedId);
    if (!order) return null;
    return (
      <div className="space-y-3">
        {email.status === "bounced" ? (
          <p className="rounded-lg border border-rose-400/30 bg-rose-400/10 px-3 py-2 text-sm text-rose-200">
            The mailbox rejected this receipt.
          </p>
        ) : null}
        <Receipt order={order} />
        <Link
          href={`/dashboard/orders?id=${order.id}`}
          className={`text-sm text-accent ${focusRing} rounded-sm`}
        >
          Open {order.id}
        </Link>
      </div>
    );
  }

  if (email.relatedKind === "refund") {
    const refund = findRefund(email.relatedId);
    if (!refund) return null;
    return (
      <div className="space-y-3 rounded-xl border border-white/10 bg-[#10151d] p-4 text-sm">
        <p className="font-mono text-[10px] tracking-[0.18em] text-accent">
          {email.kind === "Review request" ? "REVIEW" : "REFUND NOTICE"}
        </p>
        <p>
          {refund.id} · {refund.customerName}
        </p>
        <p className="text-2xl font-medium tabular-nums">−{money(refund.cents)}</p>
        <p className="text-muted">{refund.reason}</p>
        <p className="text-muted">{refund.response}</p>
        <Link
          href={`/dashboard/refunds?id=${refund.id}`}
          className={`inline-block text-accent ${focusRing} rounded-sm`}
        >
          Open {refund.id}
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#10151d] p-4 font-mono text-xs leading-5">
      <p className="tracking-[0.18em] text-accent">VOLSKI PAY</p>
      <p className="mt-3">Batch {email.relatedId} settled.</p>
      <p className="text-muted">
        {merchant.name} · next batch {merchant.batch} is open.
      </p>
    </div>
  );
}
