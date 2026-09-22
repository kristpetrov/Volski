import type { Metadata } from "next";
import { Overview } from "@/components/console/overview";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return <Overview />;
}
