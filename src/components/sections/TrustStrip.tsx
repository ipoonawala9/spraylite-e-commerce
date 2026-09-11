import { Factory, Leaf, Truck, Wallet } from "lucide-react";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/cart-math";
import { formatINR } from "@/lib/format";

const points = [
  {
    icon: Factory,
    title: "Made in Mumbai",
    body: "Manufactured in India, not imported.",
  },
  {
    icon: Leaf,
    title: "No chemical propellants",
    body: "Just oil, in a fine, even mist.",
  },
  {
    icon: Truck,
    title: `Free delivery over ${formatINR(FREE_DELIVERY_THRESHOLD)}`,
    body: "Across India, usually in 3 to 5 days.",
  },
  { icon: Wallet, title: "Cash on delivery", body: "Or pay by UPI and cards." },
];

export function TrustStrip() {
  return (
    <section
      aria-label="Why shop with us"
      className="border-y border-ink/10 bg-tin"
    >
      <ul className="page-x grid grid-cols-2 gap-x-6 gap-y-6 py-8 lg:grid-cols-4">
        {points.map(({ icon: Icon, title, body }) => (
          <li key={title} className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-aluminium">
              <Icon aria-hidden className="size-5 text-brand" />
            </span>
            <div>
              <p className="leading-snug font-semibold">{title}</p>
              <p className="type-small text-ink-soft">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
