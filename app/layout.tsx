import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://dervyx.159.69.241.122.sslip.io"),
  title: "Dervyx \u00b7 Base funding-anomaly certificates",
  description:
    "Read-only Base tool that turns one token and a block window into a reproducible, hash-verifiable funding and volume anomaly certificate. It reports observed relationships, not accusations.",
  applicationName: "Dervyx",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Dervyx",
    url: "/",
    title: "Dervyx \u00b7 Base funding-anomaly certificates",
    description:
      "Read-only Base tool that turns one token and a block window into a reproducible, hash-verifiable funding-anomaly certificate. Evidence, not accusations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dervyx \u00b7 Base funding-anomaly certificates",
    description:
      "Read-only Base tool that turns one token and a block window into a reproducible, hash-verifiable funding-anomaly certificate. Evidence, not accusations.",
  },
};

export const viewport: Viewport = {
  themeColor: "#101416",
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink font-sans text-cream antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-teal/40 focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-teal"
        >
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
