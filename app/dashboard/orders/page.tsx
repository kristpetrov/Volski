import type { Metadata } from "next";
import { OrdersBoard } from "@/components/console/orders-board";
import { readId } from "@/lib/read-id";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[] }>;
}) {
  const id = await readId(searchParams);
  return <OrdersBoard key={id ?? "ledger"} initialId={id} />;
}
