"use client";

import { ChevronRight, Phone } from "lucide-react";
import { Sheet } from "@/components/ui/Sheet";
import { SPRAYLITE_PHONE, navLinks } from "@/data/navigation";
import { FREE_DELIVERY_THRESHOLD } from "@/lib/cart-math";
import { formatINR } from "@/lib/format";
import { scrollToSection } from "@/lib/shop-actions";
import { useUI } from "@/store/ui";

export function MobileMenu() {
  const open = useUI((state) => state.panel === "menu");
  const close = useUI((state) => state.closePanel);

  return (
    <Sheet side="left" open={open} onClose={close} title="Menu">
      <nav aria-label="Mobile">
        <ul>
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(event) => {
                  event.preventDefault();
                  close();
                  // Let the sheet release scroll lock before scrolling.
                  window.setTimeout(() => scrollToSection(link.href), 60);
                }}
                className="flex items-center justify-between border-b border-ink/10 py-4 font-display text-2xl font-bold tracking-tight"
              >
                {link.label}
                <ChevronRight aria-hidden className="size-5 text-ink-soft" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-8 space-y-3 text-ink-soft">
        <p className="type-small">
          Free delivery on orders over {formatINR(FREE_DELIVERY_THRESHOLD)}.
          Made in Mumbai.
        </p>
        <a
          href={SPRAYLITE_PHONE.href}
          className="inline-flex items-center gap-2 font-semibold text-ink underline underline-offset-4"
        >
          <Phone aria-hidden className="size-4" />
          {SPRAYLITE_PHONE.display}
        </a>
      </div>
    </Sheet>
  );
}
