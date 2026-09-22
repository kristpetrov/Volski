import type { Metadata } from "next";
import { RefundsBoard } from "@/components/console/refunds-board";
import { readId } from "@/lib/read-id";

export const metadata: Metadata = {
  title: "Refunds",
};

export default async function RefundsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[] }>;
}) {
  const id = await readId(searchParams);
  return <RefundsBoard key={id ?? "ledger"} initialId={id} />;
}
