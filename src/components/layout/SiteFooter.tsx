import Link from "next/link";
import { ArrowUpRight, Instagram, Mail, Phone } from "lucide-react";
import { brandConfig } from "@/config/brand.config";

export function SiteFooter({ context = "ARCHITECTURE / SPATIAL PRACTICE" }: { context?: string }) {
  return (
    <footer className="site-footer page-gutter">
      <div className="site-footer-top">
        <Link className="footer-wordmark" href="/" aria-label={`${brandConfig.name}, home`}>{brandConfig.wordmark}<span>.</span></Link>
        <span className="site-footer-context mono">{context}</span>
        <Link className="site-footer-return mono" href="/#home">RETURN TO BEGINNING <ArrowUpRight size={13} aria-hidden="true" /></Link>
      </div>
      <nav className="site-footer-contacts" aria-label="Direct contact">
        <a href="https://www.instagram.com/reel_archer.studios/" target="_blank" rel="noreferrer"><span><Instagram size={14} aria-hidden="true" />INSTAGRAM</span><strong>@reel_archer.studios</strong><ArrowUpRight size={13} aria-hidden="true" /></a>
        <a href="mailto:info@reelacherstudios.com"><span><Mail size={14} aria-hidden="true" />EMAIL</span><strong>info@reelacherstudios.com</strong><ArrowUpRight size={13} aria-hidden="true" /></a>
        <a href="tel:+254701123511"><span><Phone size={14} aria-hidden="true" />PHONE</span><strong>+254 701 123511</strong><ArrowUpRight size={13} aria-hidden="true" /></a>
      </nav>
    </footer>
  );
}
