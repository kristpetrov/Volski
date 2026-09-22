# Volski POS

Point of sale and payment operations for the counter: orders, customers, refunds, and receipt mail.

The dashboard is a design concept for Northline Market, a sample merchant. Figures, tickets, and messages are not live processing.

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000), then enter the dashboard.

- `/dashboard` — operating day, batch, and the register lane
- `/dashboard/orders` — tickets, tenders, and auth codes
- `/dashboard/customers` — profiles and cards on file
- `/dashboard/refunds` — returns, review holds, and declines
- `/dashboard/emails` — receipts and notices

## Stack

- Next.js
- React
- Tailwind CSS
