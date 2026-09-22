import type { Metadata } from "next";
import { EmailsBoard } from "@/components/console/emails-board";
import { readId } from "@/lib/read-id";

export const metadata: Metadata = {
  title: "Emails",
};

export default async function EmailsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[] }>;
}) {
  const id = await readId(searchParams);
  return <EmailsBoard key={id ?? "ledger"} initialId={id} />;
}
