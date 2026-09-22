"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { focusRing } from "@/components/console/styles";

const items = [
  { href: "/dashboard", label: "Dashboard", exact: true },
  { href: "/dashboard/orders", label: "Orders", exact: false },
  { href: "/dashboard/customers", label: "Customers", exact: false },
  { href: "/dashboard/refunds", label: "Refunds", exact: false },
  { href: "/dashboard/emails", label: "Emails", exact: false },
];

export function ConsoleNav({
  orientation,
}: {
  orientation: "vertical" | "horizontal";
}) {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Dashboard"
      className={
        orientation === "vertical"
          ? "flex flex-col gap-1 px-3"
          : "flex w-max gap-1 px-3 py-2"
      }
    >
      {items.map((item) => {
        const active = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-lg whitespace-nowrap ${focusRing} ${orientation === "vertical" ? "px-3 py-2 text-sm" : "px-2 py-2 text-[13px]"} ${active ? "bg-accent/10 text-accent" : "text-muted hover:bg-white/5 hover:text-foreground"}`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
