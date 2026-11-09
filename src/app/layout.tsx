import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { ArchitecturalGrid } from "@/components/layout/ArchitecturalGrid";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { CursorProvider } from "@/components/cursor/CursorProvider";
import { canIndexSite, canonicalOrigin, metadataOrigin, noIndexRobots, siteMetadata } from "@/lib/seo/site-config";
import { serializeJsonLd, siteJsonLd } from "@/lib/seo/structured-data";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], variable: "--font-editorial", display: "swap", weight: ["400"] });

export const metadata: Metadata = {
  metadataBase: new URL(metadataOrigin),
  icons: { icon: "/logo.jpeg", apple: "/logo.jpeg" },
  title: { default: "Reel Archer | Architecture", template: "%s | Reel Archer" },
  description: siteMetadata.description,
  alternates: canIndexSite && canonicalOrigin ? { canonical: canonicalOrigin } : undefined,
  openGraph: { type: "website", siteName: siteMetadata.name, title: "Reel Archer | Architecture", description: siteMetadata.description, ...(canonicalOrigin ? { url: canonicalOrigin } : {}) },
  twitter: { card: "summary_large_image", title: "Reel Archer | Architecture", description: siteMetadata.description },
  robots: canIndexSite ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } } : noIndexRobots,
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f1f0eb" };

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const jsonLd = siteJsonLd();
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}>
      <body>
        {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />}
        <SmoothScrollProvider>
          <ArchitecturalGrid />
          <CursorProvider>{children}</CursorProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
