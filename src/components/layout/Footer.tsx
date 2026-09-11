import { AMAZON_STORE_URL, SPRAYLITE_PHONE, navLinks } from "@/data/navigation";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-ink text-tin">
      <div className="page-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo height={64} className="h-16" />
          <p className="mt-4 max-w-[30ch] text-tin/75">
            Precision cooking oil sprays, made in Mumbai. Spray smart, cook
            lite.
          </p>
        </div>

        <FooterColumn title="On this page">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="footer-link">
                {link.label}
              </a>
            </li>
          ))}
        </FooterColumn>

        <FooterColumn title="Buy elsewhere">
          <li>
            <a
              href={AMAZON_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Spraylite on Amazon{" "}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        </FooterColumn>

        <FooterColumn title="Talk to us">
          <li>
            <a href={SPRAYLITE_PHONE.href} className="footer-link">
              {SPRAYLITE_PHONE.display}
            </a>
          </li>
          <li className="text-tin/75">Monday to Saturday, 9am to 6pm</li>
          <li className="text-tin/75">Fort, Mumbai 400001</li>
        </FooterColumn>
      </div>

      <div className="border-t border-tin/15">
        <div className="page-x flex flex-col gap-2 py-6 type-small text-tin/70 md:flex-row md:justify-between md:gap-8">
          <p>© 2026 Spraylite</p>
          <p className="md:text-right">
            Demo storefront built for a frontend assessment. Prices, ratings and
            reviews are placeholders. Food photography from{" "}
            <a
              href="https://unsplash.com"
              className="underline underline-offset-4 hover:text-tin"
            >
              Unsplash
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-tin">{title}</h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}
