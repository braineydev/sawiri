import type { Metadata } from "next";
import { Navigation } from "@/components/navigation/Navigation";
import { StudioPage } from "@/components/studio/StudioPage";
import { canIndexSite, canonicalOrigin, noIndexRobots } from "@/lib/seo/site-config";

export const metadata: Metadata = {
  title: "The Studio",
  description: "Studio notes, architectural approach, and methodology from Reel Archer.",
  alternates: canIndexSite && canonicalOrigin ? { canonical: new URL("/studio", canonicalOrigin).toString() } : undefined,
  openGraph: { type: "website", title: "The Studio | Reel Archer", description: "Studio notes, architectural approach, and methodology from Reel Archer." },
  twitter: { card: "summary_large_image", title: "The Studio | Reel Archer", description: "Studio notes, architectural approach, and methodology from Reel Archer." },
  robots: canIndexSite ? { index: true, follow: true } : noIndexRobots,
};

export default function StudioRoute() {
  return <><Navigation /><StudioPage /></>;
}
