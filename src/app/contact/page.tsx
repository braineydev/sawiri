import type { Metadata } from "next";
import { Navigation } from "@/components/navigation/Navigation";
import { InquiryConfigurator } from "@/components/inquiry/InquiryConfigurator";
import { ContactDirectLinks } from "@/components/contact/ContactDirectLinks";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { canIndexSite, canonicalOrigin, noIndexRobots } from "@/lib/seo/site-config";

export const metadata: Metadata = {
  title: "Project Inquiry",
  description: "Share an early outline of an architectural project with Reel Archer.",
  alternates: canIndexSite && canonicalOrigin ? { canonical: new URL("/contact", canonicalOrigin).toString() } : undefined,
  openGraph: { type: "website", title: "Project Inquiry | Reel Archer", description: "Share an early outline of an architectural project with Reel Archer." },
  twitter: { card: "summary_large_image", title: "Project Inquiry | Reel Archer", description: "Share an early outline of an architectural project with Reel Archer." },
  robots: canIndexSite ? { index: true, follow: true } : noIndexRobots,
};

export default function ContactRoute() {
  return <main className="contact-page"><Navigation /><InquiryConfigurator turnstileSiteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} /><ContactDirectLinks /><SiteFooter context="PROJECT INQUIRY / DIRECT CONTACT" /></main>;
}
