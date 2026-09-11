import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Bricolage_Grotesque } from "next/font/google";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TinDefs } from "@/components/product/Tin";
import { AppToaster } from "@/components/providers/AppToaster";
import { Overlays } from "@/components/providers/Overlays";
import { Providers } from "@/components/providers/Providers";
import { StoreHydrator } from "@/components/providers/StoreHydrator";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz"],
  variable: "--font-bricolage",
  display: "swap",
});

// Two weights, Latin only, to keep first-load font bytes down. The ₹ sign
// isn't in the Latin subset, so it uses the system font's glyph.
const body = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-vietnam",
  display: "swap",
});

const description =
  "Precision cooking oil sprays in seven flavours, made in Mumbai. Less oil, more control, better taste. Free delivery over ₹499.";

// Absolute URLs for the share image: Vercel's production domain when deployed.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Spraylite | Spray Smart. Cook Lite.",
  description,
  applicationName: "Spraylite",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Spraylite",
    title: "Spraylite | Spray Smart. Cook Lite.",
    description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#E6E9EC",
  colorScheme: "light",
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Spraylite",
  description,
  telephone: "+91-22-4052-1777",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Mumbai",
    addressRegion: "Maharashtra",
    addressCountry: "IN",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-60 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:font-semibold focus:text-tin"
        >
          Skip to content
        </a>
        <TinDefs />
        <Providers>
          <AnnouncementBar />
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <Overlays />
          <AppToaster />
          <StoreHydrator />
        </Providers>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
      </body>
    </html>
  );
}
