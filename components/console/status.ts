import type { EmailStatus, OrderStatus, RefundStatus } from "@/lib/demo-data";
import type { ComponentProps } from "react";
import { StatusPill } from "@/components/console/ui";

type Tone = ComponentProps<typeof StatusPill>["tone"];

export const orderStatusLabel: Record<OrderStatus, string> = {
  open: "Open",
  authorized: "Authorized",
  captured: "Captured",
  voided: "Voided",
};

export const orderTone: Record<OrderStatus, Tone> = {
  open: "hold",
  authorized: "info",
  captured: "good",
  voided: "bad",
};

export const refundStatusLabel: Record<RefundStatus, string> = {
  review: "In review",
  settled: "Settled",
  declined: "Declined",
};

export const refundTone: Record<RefundStatus, Tone> = {
  review: "hold",
  settled: "good",
  declined: "bad",
};

export const emailStatusLabel: Record<EmailStatus, string> = {
  queued: "Queued",
  delivered: "Delivered",
  opened: "Opened",
  bounced: "Bounced",
};

export const emailTone: Record<EmailStatus, Tone> = {
  queued: "neutral",
  delivered: "good",
  opened: "info",
  bounced: "bad",
};
