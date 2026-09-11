"use client";

import { Heart, Menu, ShoppingBag } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { IconButton } from "@/components/ui/IconButton";
import { navLinks } from "@/data/navigation";
import { cartCount } from "@/lib/cart-math";
import { m } from "@/lib/motion";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { useWishlist } from "@/store/wishlist";
import { Logo } from "./Logo";

export function Header() {
  const openPanel = useUI((state) => state.openPanel);
  const units = useCart((state) => cartCount(state.items));
  const saved = useWishlist((state) => state.ids.length);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/[0.07] glass">
      <div className="page-x flex h-16 items-center gap-2 md:h-[4.5rem] md:gap-8">
        <IconButton
          label="Open menu"
          className="-ml-2 md:hidden"
          onClick={() => openPanel("menu")}
        >
          <Menu aria-hidden className="size-6" />
        </IconButton>

        <Link href="/" className="shrink-0 rounded-lg">
          <Logo height={48} eager className="h-11 md:h-12" />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="press rounded-full px-3.5 py-2 text-[0.95rem] text-ink hover:bg-ink/6"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <CountButton
            label={`Wishlist, ${saved} saved`}
            count={saved}
            onClick={() => openPanel("wishlist")}
          >
            <Heart aria-hidden className="size-[1.375rem]" />
          </CountButton>
          <CountButton
            label={`Cart, ${units} ${units === 1 ? "item" : "items"}`}
            count={units}
            onClick={() => openPanel("cart")}
          >
            <ShoppingBag aria-hidden className="size-[1.375rem]" />
          </CountButton>
        </div>
      </div>
    </header>
  );
}

interface CountButtonProps {
  label: string;
  count: number;
  onClick: () => void;
  children: ReactNode;
}

function CountButton({ label, count, onClick, children }: CountButtonProps) {
  return (
    <IconButton label={label} onClick={onClick}>
      {children}
      {count > 0 && (
        <m.span
          key={count}
          aria-hidden
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.45, duration: 0.35 }}
          className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-lite px-1 text-[0.6875rem] font-bold text-ink tabular-nums ring-2 ring-aluminium"
        >
          {count}
        </m.span>
      )}
    </IconButton>
  );
}
