"use client";

import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Menu, X } from "lucide-react";
import { brandConfig } from "@/config/brand.config";
import { navigationItems } from "@/config/navigation.config";
import { demoProjects } from "@/data/projects";
import { MagneticLink } from "@/components/cursor/MagneticLink";

export function Navigation() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  const openMenu = () => {
    if (!dialog.current || dialog.current.open) return;
    dialog.current.showModal();
    setOpen(true);
  };

  const closeMenu = () => {
    if (dialog.current?.open) dialog.current.close();
  };

  const handleClose = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  const handleBackdrop = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialog.current) closeMenu();
  };

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab" || !dialog.current) return;
    const items = Array.from(dialog.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])"))
      .filter((element) => element.getAttribute("aria-hidden") !== "true");
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && active === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    } else if (!dialog.current.contains(active)) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      <header className="site-navigation page-gutter">
        <Link href="/#home" className="nav-wordmark" aria-label={`${brandConfig.name}, home`}>
          {brandConfig.wordmark}<span>.</span>
        </Link>
        <span className="nav-descriptor mono">{brandConfig.descriptor}</span>
        <div className="nav-actions">
          <MagneticLink href="/#showreel" className="nav-study-link mono" data-cursor="view">VISUAL STUDY <ArrowUpRight size={14} /></MagneticLink>
          <button ref={trigger} className="menu-trigger mono" type="button" onClick={openMenu} aria-haspopup="dialog" aria-expanded={open} aria-controls="sawiri-menu">
            <span>MENU</span><span className="menu-trigger-icon"><Menu size={17} strokeWidth={1.4} /></span>
          </button>
        </div>
      </header>

      <dialog ref={dialog} id="sawiri-menu" className="menu-dialog" aria-label="Reel Archer site navigation" onClose={handleClose} onClick={handleBackdrop} onKeyDown={handleDialogKeyDown}>
        <div className="menu-panel page-gutter">
          <div className="menu-topline">
            <Link href="/#home" className="nav-wordmark menu-wordmark" onClick={closeMenu} aria-label={`${brandConfig.name}, home`}>{brandConfig.wordmark}<span>.</span></Link>
            <span className="mono menu-edition">SPATIAL INDEX / 01—03</span>
            <button className="menu-close mono" type="button" onClick={closeMenu} autoFocus><span>CLOSE</span><X size={17} strokeWidth={1.4} /></button>
          </div>
          <div className="menu-content">
            <p className="eyebrow mono menu-label">NAVIGATE / REEL ARCHER</p>
            <nav aria-label="Main navigation" className="menu-links">
              {navigationItems.map((item) => (
                  <Link className="menu-link" href={item.href} key={item.href} onClick={closeMenu} data-cursor="view">
                  <span className="menu-number mono">{item.number}</span>
                  <span className="menu-link-title">{item.label}<ArrowUpRight className="menu-link-arrow" size={22} strokeWidth={1.2} /></span>
                  <span className="menu-detail mono">{item.detail}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="menu-bottomline mono"><span>REEL ARCHER / PROVISIONAL DIGITAL STUDY</span><span>STUDIO / 01—04</span><Link href="/#contact" onClick={closeMenu}>START AN INQUIRY <ArrowDownRight size={13} /></Link></div>
          <div className="menu-image-index" aria-hidden="true">
            <Image src={demoProjects[1].hero_image_url} alt="" fill sizes="(max-width: 700px) 0px, 220px" />
            <span className="mono">IMAGE STUDY / DEMONSTRATION</span>
          </div>
        </div>
      </dialog>
    </>
  );
}
