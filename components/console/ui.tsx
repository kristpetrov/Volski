import {
  orderSubtotal,
  orderTotal,
  tenderLabel,
  whenLabel,
  type Order,
} from "@/lib/demo-data";
import { money } from "@/lib/money";

export function StatusPill({
  tone,
  children,
}: {
  tone: "good" | "hold" | "info" | "bad" | "neutral";
  children: React.ReactNode;
}) {
  const tones = {
    good: "bg-emerald-400/10 text-emerald-300",
    hold: "bg-amber-300/10 text-amber-200",
    info: "bg-accent/10 text-accent",
    bad: "bg-rose-400/10 text-rose-300",
    neutral: "bg-white/5 text-muted",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] uppercase ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function Ledger({
  columns,
  children,
}: {
  columns: { label: string; align?: "right" }[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead className="bg-[#0c1017] font-mono text-[10px] tracking-[0.16em] text-muted">
          <tr>
            {columns.map((column) => (
              <th
                key={column.label}
                scope="col"
                className={`px-4 py-3 font-normal ${column.align === "right" ? "text-right" : ""}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function ledgerRowClass(active: boolean) {
  return `border-t border-white/8 outline-none transition-colors hover:bg-white/[0.03] ${active ? "bg-accent/[0.07]" : ""}`;
}

export function MetaList({
  items,
}: {
  items: { label: string; value: string }[];
}) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="font-mono text-[10px] tracking-[0.16em] text-muted">
            {item.label}
          </dt>
          <dd className="mt-1 text-sm">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ChargeSummary({ order }: { order: Order }) {
  return (
    <div>
      <ul className="space-y-2 text-sm">
        {order.lines.map((line, index) => (
          <li
            key={`${line.name}-${index}`}
            className="flex justify-between gap-3"
          >
            <span className="text-muted">
              {line.qty} × {line.name}
            </span>
            <span className="tabular-nums">
              {money(line.qty * line.unitCents)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-3 space-y-1 border-t border-white/10 pt-3 text-sm">
        <div className="flex justify-between text-muted">
          <span>Subtotal</span>
          <span className="tabular-nums">{money(orderSubtotal(order))}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Tax</span>
          <span className="tabular-nums">{money(order.taxCents)}</span>
        </div>
      </div>
    </div>
  );
}

export function Receipt({ order }: { order: Order }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#10151d] p-4 font-mono text-xs leading-5">
      <p className="tracking-[0.18em] text-accent">NORTHLINE MARKET</p>
      <p className="text-muted">Downtown · {order.terminal}</p>
      <p className="mt-3 text-muted">
        {order.id} · {whenLabel(order.day, order.at)}
      </p>
      <div className="mt-3 space-y-1 border-t border-dashed border-white/15 pt-3">
        {order.lines.map((line, index) => (
          <div key={`${line.name}-${index}`} className="flex justify-between gap-3">
            <span>
              {line.qty} {line.name}
            </span>
            <span className="tabular-nums">
              {money(line.qty * line.unitCents)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1 border-t border-dashed border-white/15 pt-3">
        <div className="flex justify-between text-muted">
          <span>Subtotal</span>
          <span>{money(orderSubtotal(order))}</span>
        </div>
        <div className="flex justify-between text-muted">
          <span>Tax</span>
          <span>{money(order.taxCents)}</span>
        </div>
        <div className="flex justify-between text-sm text-foreground">
          <span>Total</span>
          <span>{money(orderTotal(order))}</span>
        </div>
      </div>
      <p className="mt-3 text-muted">
        {tenderLabel(order.tender)}
        {order.authCode ? ` · ${order.authCode}` : ""}
      </p>
    </div>
  );
}

export function EmptyLedger({
  colSpan,
  children,
}: {
  colSpan: number;
  children: React.ReactNode;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-10 text-center text-sm text-muted">
        {children}
      </td>
    </tr>
  );
}
