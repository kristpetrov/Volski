export const merchant = {
  name: "Northline Market",
  location: "Downtown",
  terminal: "T-04",
  batch: "4418",
  settlement: "21:00 PT",
};

export const day = {
  capturedCents: 1_842_050,
  captures: 142,
  authorizedCents: 64_000,
  openAuths: 1,
  refundCents: 41_200,
  refundsInReview: 1,
  emailsSent: 86,
  bounced: 1,
  declines: 2,
};

export const volume = [
  { hour: "07", cents: 42_000 },
  { hour: "08", cents: 186_000 },
  { hour: "09", cents: 264_000 },
  { hour: "10", cents: 310_000 },
  { hour: "11", cents: 248_000 },
  { hour: "12", cents: 402_000 },
  { hour: "13", cents: 221_000 },
  { hour: "14", cents: 169_050 },
];

export type Tender = {
  brand: "Visa" | "Mastercard" | "Amex" | "Cash";
  last4?: string;
  entry: "Chip" | "Tap" | "Keyed" | "Cash";
};

export type OrderLine = {
  name: string;
  qty: number;
  unitCents: number;
};

export type OrderStatus = "open" | "authorized" | "captured" | "voided";

export type Order = {
  id: string;
  at: string;
  day: "Today" | "Yesterday";
  customerId: string | null;
  customerName: string;
  terminal: string;
  status: OrderStatus;
  tender: Tender | null;
  lines: OrderLine[];
  taxCents: number;
  authCode?: string;
  note?: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  visits: number;
  lifetimeCents: number;
  since: string;
  tender: Tender;
  note?: string;
};

export type RefundStatus = "review" | "settled" | "declined";

export type Refund = {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  cents: number;
  reason: string;
  actor: string;
  status: RefundStatus;
  day: "Today" | "Yesterday";
  at: string;
  response: string;
};

export type EmailStatus = "queued" | "delivered" | "opened" | "bounced";

export type EmailKind =
  | "Receipt"
  | "Refund notice"
  | "Review request"
  | "Batch summary";

export type Email = {
  id: string;
  kind: EmailKind;
  to: string;
  subject: string;
  relatedKind: "order" | "refund" | "batch";
  relatedId: string;
  status: EmailStatus;
  day: "Today" | "Yesterday";
  at: string;
  delivery: string;
};

export const customers: Customer[] = [
  {
    id: "CUS-1042",
    name: "Maya Chen",
    email: "maya.chen@example.com",
    phone: "(415) 555-0142",
    visits: 28,
    lifetimeCents: 84_260,
    since: "Mar 2024",
    tender: { brand: "Visa", last4: "4242", entry: "Chip" },
    note: "Prefers the receipt by email.",
  },
  {
    id: "CUS-1108",
    name: "Jonah Hale",
    email: "jonah.hale@example.com",
    phone: "(415) 555-0177",
    visits: 6,
    lifetimeCents: 21_440,
    since: "Jan 2026",
    tender: { brand: "Mastercard", last4: "5512", entry: "Keyed" },
    note: "Catering orders are authorized, then captured at pickup.",
  },
  {
    id: "CUS-0981",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "(415) 555-0194",
    visits: 41,
    lifetimeCents: 120_650,
    since: "Nov 2023",
    tender: { brand: "Visa", last4: "1881", entry: "Chip" },
  },
  {
    id: "CUS-1214",
    name: "Ellis Ward",
    email: "ellis.ward@example.com",
    phone: "(415) 555-0118",
    visits: 3,
    lifetimeCents: 6_580,
    since: "Aug 2026",
    tender: { brand: "Cash", entry: "Cash" },
    note: "The receipt mailbox is rejecting mail.",
  },
  {
    id: "CUS-0877",
    name: "Sam Ortega",
    email: "sam.ortega@example.com",
    phone: "(415) 555-0160",
    visits: 12,
    lifetimeCents: 33_420,
    since: "Jun 2025",
    tender: { brand: "Visa", last4: "9910", entry: "Tap" },
  },
  {
    id: "CUS-1302",
    name: "Lena Brooks",
    email: "lena.brooks@example.com",
    phone: "(415) 555-0133",
    visits: 9,
    lifetimeCents: 19_880,
    since: "Feb 2026",
    tender: { brand: "Amex", last4: "1008", entry: "Tap" },
  },
];

export const orders: Order[] = [
  {
    id: "TKT-18424",
    at: "11:06",
    day: "Today",
    customerId: null,
    customerName: "Counter",
    terminal: "T-04",
    status: "open",
    tender: null,
    lines: [
      { name: "Oat milk", qty: 1, unitCents: 180 },
      { name: "Sourdough loaf", qty: 1, unitCents: 580 },
    ],
    taxCents: 61,
    note: "Still on the register. No card read yet.",
  },
  {
    id: "TKT-18422",
    at: "10:41",
    day: "Today",
    customerId: "CUS-1108",
    customerName: "Jonah Hale",
    terminal: "T-04",
    status: "authorized",
    tender: { brand: "Mastercard", last4: "5512", entry: "Keyed" },
    lines: [
      { name: "Catering tray", qty: 1, unitCents: 52_000 },
      { name: "Sparkling water", qty: 4, unitCents: 2_500 },
    ],
    taxCents: 2_000,
    authCode: "H4K19",
    note: "Capture after the catering tray is picked up.",
  },
  {
    id: "TKT-18421",
    at: "09:22",
    day: "Today",
    customerId: "CUS-1302",
    customerName: "Lena Brooks",
    terminal: "T-02",
    status: "captured",
    tender: { brand: "Amex", last4: "1008", entry: "Tap" },
    lines: [
      { name: "House salad", qty: 1, unitCents: 1_400 },
      { name: "Iced tea", qty: 1, unitCents: 450 },
    ],
    taxCents: 148,
    authCode: "T20LQ",
  },
  {
    id: "TKT-18420",
    at: "09:14",
    day: "Today",
    customerId: "CUS-1042",
    customerName: "Maya Chen",
    terminal: "T-04",
    status: "captured",
    tender: { brand: "Visa", last4: "4242", entry: "Chip" },
    lines: [
      { name: "Cold brew 16oz", qty: 2, unitCents: 450 },
      { name: "Almond croissant", qty: 1, unitCents: 450 },
    ],
    taxCents: 108,
    authCode: "A91K2",
  },
  {
    id: "TKT-18418",
    at: "08:55",
    day: "Today",
    customerId: "CUS-0981",
    customerName: "Priya Nair",
    terminal: "T-01",
    status: "captured",
    tender: { brand: "Visa", last4: "1881", entry: "Chip" },
    lines: [
      { name: "Olive oil 500ml", qty: 1, unitCents: 1_800 },
      { name: "Almond croissant", qty: 1, unitCents: 450 },
    ],
    taxCents: 180,
    authCode: "P881C",
  },
  {
    id: "TKT-18411",
    at: "08:12",
    day: "Today",
    customerId: "CUS-1214",
    customerName: "Ellis Ward",
    terminal: "T-02",
    status: "captured",
    tender: { brand: "Cash", entry: "Cash" },
    lines: [
      { name: "Eggs", qty: 1, unitCents: 690 },
      { name: "Flowers", qty: 1, unitCents: 1_400 },
    ],
    taxCents: 167,
  },
  {
    id: "TKT-18407",
    at: "08:02",
    day: "Today",
    customerId: "CUS-0877",
    customerName: "Sam Ortega",
    terminal: "T-04",
    status: "voided",
    tender: { brand: "Visa", last4: "9910", entry: "Tap" },
    lines: [{ name: "Roast sandwich", qty: 2, unitCents: 1_050 }],
    taxCents: 168,
    authCode: "S77VX",
    note: "Second tap on T-04. Voided on the terminal before capture.",
  },
  {
    id: "TKT-18391",
    at: "16:40",
    day: "Yesterday",
    customerId: "CUS-1108",
    customerName: "Jonah Hale",
    terminal: "T-01",
    status: "captured",
    tender: { brand: "Mastercard", last4: "5512", entry: "Chip" },
    lines: [{ name: "Chicken pie", qty: 1, unitCents: 2_200 }],
    taxCents: 200,
    authCode: "J193M",
  },
  {
    id: "TKT-18370",
    at: "15:05",
    day: "Yesterday",
    customerId: "CUS-1302",
    customerName: "Lena Brooks",
    terminal: "T-02",
    status: "captured",
    tender: { brand: "Amex", last4: "1008", entry: "Tap" },
    lines: [{ name: "Cedar candle", qty: 1, unitCents: 1_280 }],
    taxCents: 0,
    authCode: "L4402",
  },
];

export const refunds: Refund[] = [
  {
    id: "RFD-2214",
    orderId: "TKT-18418",
    customerId: "CUS-0981",
    customerName: "Priya Nair",
    cents: 450,
    reason: "Wrong item on the ticket",
    actor: "A. Ruiz · Register",
    status: "review",
    day: "Today",
    at: "10:06",
    response: "Held for a manager. Funds have not moved.",
  },
  {
    id: "RFD-2216",
    orderId: "TKT-18407",
    customerId: "CUS-0877",
    customerName: "Sam Ortega",
    cents: 2_268,
    reason: "Reverse a voided sale",
    actor: "M. Cho · Manager",
    status: "declined",
    day: "Today",
    at: "08:11",
    response: "Original sale is already voided. Nothing to return.",
  },
  {
    id: "RFD-2208",
    orderId: "TKT-18391",
    customerId: "CUS-1108",
    customerName: "Jonah Hale",
    cents: 2_400,
    reason: "Item unavailable",
    actor: "A. Ruiz · Register",
    status: "settled",
    day: "Yesterday",
    at: "17:12",
    response: "Returned to Mastercard 5512.",
  },
  {
    id: "RFD-2194",
    orderId: "TKT-18370",
    customerId: "CUS-1302",
    customerName: "Lena Brooks",
    cents: 1_280,
    reason: "Duplicate charge",
    actor: "M. Cho · Manager",
    status: "settled",
    day: "Yesterday",
    at: "15:22",
    response: "Returned to Amex 1008.",
  },
];

export const emails: Email[] = [
  {
    id: "EML-90455",
    kind: "Review request",
    to: "manager@example.com",
    subject: "Refund RFD-2214 is waiting on review",
    relatedKind: "refund",
    relatedId: "RFD-2214",
    status: "queued",
    day: "Today",
    at: "10:06",
    delivery: "Queued for the next send",
  },
  {
    id: "EML-90438",
    kind: "Receipt",
    to: "lena.brooks@example.com",
    subject: "Receipt for TKT-18421",
    relatedKind: "order",
    relatedId: "TKT-18421",
    status: "delivered",
    day: "Today",
    at: "09:22",
    delivery: "250 Accepted",
  },
  {
    id: "EML-90441",
    kind: "Receipt",
    to: "maya.chen@example.com",
    subject: "Receipt for TKT-18420",
    relatedKind: "order",
    relatedId: "TKT-18420",
    status: "opened",
    day: "Today",
    at: "09:14",
    delivery: "250 Accepted",
  },
  {
    id: "EML-90390",
    kind: "Receipt",
    to: "ellis.ward@example.com",
    subject: "Receipt for TKT-18411",
    relatedKind: "order",
    relatedId: "TKT-18411",
    status: "bounced",
    day: "Today",
    at: "08:12",
    delivery: "550 Mailbox unavailable",
  },
  {
    id: "EML-90310",
    kind: "Batch summary",
    to: "owner@example.com",
    subject: "Batch 4417 settled",
    relatedKind: "batch",
    relatedId: "4417",
    status: "delivered",
    day: "Yesterday",
    at: "21:04",
    delivery: "250 Accepted",
  },
  {
    id: "EML-90422",
    kind: "Refund notice",
    to: "jonah.hale@example.com",
    subject: "Refund for TKT-18391",
    relatedKind: "refund",
    relatedId: "RFD-2208",
    status: "opened",
    day: "Yesterday",
    at: "17:13",
    delivery: "250 Accepted",
  },
  {
    id: "EML-90402",
    kind: "Refund notice",
    to: "lena.brooks@example.com",
    subject: "Refund for TKT-18370",
    relatedKind: "refund",
    relatedId: "RFD-2194",
    status: "delivered",
    day: "Yesterday",
    at: "15:23",
    delivery: "250 Accepted",
  },
];

export function orderTotal(order: Order) {
  return (
    order.lines.reduce((sum, line) => sum + line.qty * line.unitCents, 0) +
    order.taxCents
  );
}

export function orderSubtotal(order: Order) {
  return order.lines.reduce((sum, line) => sum + line.qty * line.unitCents, 0);
}

export function tenderLabel(tender: Tender | null) {
  if (!tender) return "No tender";
  if (tender.brand === "Cash") return "Cash";
  return `${tender.brand} ${tender.last4} · ${tender.entry}`;
}

export function whenLabel(dayLabel: string, at: string) {
  return dayLabel === "Today" ? at : `${dayLabel} · ${at}`;
}

export function orderStateLine(order: Order) {
  switch (order.status) {
    case "open":
      return "No tender yet. The ticket is still on the register.";
    case "authorized":
      return "Approved and held. Capture when the order is handed off.";
    case "captured":
      return order.day === "Today"
        ? `Captured into batch ${merchant.batch}.`
        : "Captured in an earlier batch.";
    case "voided":
      return "Voided before capture. Nothing will settle.";
  }
}

export function findOrder(id: string) {
  return orders.find((order) => order.id === id) ?? null;
}

export function findCustomer(id: string) {
  return customers.find((customer) => customer.id === id) ?? null;
}

export function findRefund(id: string) {
  return refunds.find((refund) => refund.id === id) ?? null;
}

export function ordersForCustomer(customerId: string) {
  return orders.filter((order) => order.customerId === customerId);
}

export function refundsForOrder(orderId: string) {
  return refunds.filter((refund) => refund.orderId === orderId);
}

export function emailsForRelated(kind: Email["relatedKind"], id: string) {
  return emails.filter(
    (email) => email.relatedKind === kind && email.relatedId === id,
  );
}
