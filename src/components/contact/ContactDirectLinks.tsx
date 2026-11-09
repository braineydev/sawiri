import { ArrowUpRight, Instagram, Mail, Phone } from "lucide-react";

const contactLinks = [
  { label: "INSTAGRAM", value: "@reel_archer.studios", href: "https://www.instagram.com/reel_archer.studios/", icon: Instagram, external: true },
  { label: "EMAIL", value: "info@reelacherstudios.com", href: "mailto:info@reelacherstudios.com", icon: Mail },
  { label: "PHONE", value: "+254 701 123511", href: "tel:+254701123511", icon: Phone },
];

export function ContactDirectLinks() {
  return (
    <section className="contact-direct page-gutter" aria-labelledby="contact-direct-title">
      <div className="contact-direct-heading">
        <p className="mono">DIRECT / CONTACT</p>
        <h2 id="contact-direct-title">Prefer a direct line?</h2>
      </div>
      <div className="contact-direct-grid">
        {contactLinks.map(({ label, value, href, icon: Icon, external }) => (
          <a className="contact-direct-link" href={href} key={label} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
            <span className="contact-direct-meta mono"><span><Icon size={14} strokeWidth={1.6} aria-hidden="true" />{label}</span><ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" /></span>
            <span className="contact-direct-value">{value}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
