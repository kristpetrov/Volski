import type { Metadata } from "next";
import { CustomersBoard } from "@/components/console/customers-board";
import { readId } from "@/lib/read-id";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[] }>;
}) {
  const id = await readId(searchParams);
  return <CustomersBoard key={id ?? "ledger"} initialId={id} />;
}
