import Link from "next/link";
import Image from "next/image";
import { Facebook, Github, Instagram, Send } from "lucide-react";

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  // { icon: GiteaIcon,href: "https://gitea.com",     label: "Gitea" },
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Send, href: "https://t.me", label: "Telegram" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  // { icon: Figma,    href: "https://figma.com",     label: "Figma" },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Product", href: "/products" },
  { label: "Career", href: "/career" },
  { label: "Dealer", href: "/dealer" },
];

const resourceLinks = [
  { label: "Download App", href: "/download" },
  { label: "Email Login", href: "/login" },
  { label: "Download Brochure", href: "/brochure" },
];

const featureLinks = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "FAQs", href: "/faqs" },
  { label: "News", href: "/news" },
  { label: "What's New", href: "/whats-new" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Sales and Refunds", href: "/refunds" },
  { label: "Legal", href: "/legal" },
  { label: "Site Map", href: "/sitemap" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-linear-to-br from-primary/8 via-primary/4 to-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:py-16 lg:px-8">
        {/* ── Top: Logo + tagline ───────────────────────────────────── */}
        <div className="mb-2 flex flex-col items-center sm:items-start">
          <Link href="/" className="block w-fit">
            <Image
              src="/logos/primary.svg"
              alt="Gravis"
              height={100}
              width={250}
              className="h-auto max-w-[250px]"
            />
          </Link>
          <span className="mt-4 hidden text-xs font-medium text-muted-foreground sm:inline">
            &quot;Powering Your World, Reliably&quot;
          </span>
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-primary/15 sm:my-4" />

        {/* ── Main grid: social | quick links | resources | feature ─── */}
        <div className="grid grid-cols-2 gap-8 gap-y-10 sm:gap-10 md:grid-cols-4 md:gap-y-0 lg:gap-12">
          {/* Follow us */}
          <div className="min-w-0">
            <h3 className="font-michroma text-xs font-semibold uppercase tracking-wider text-foreground sm:text-sm">
              Follow us
            </h3>
            <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-background/60 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 hover:text-primary sm:h-9 sm:w-9"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="min-w-0">
            <h3 className="font-michroma text-xs font-semibold uppercase tracking-wider text-foreground sm:text-sm">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block py-1 text-sm text-muted-foreground transition-colors hover:text-primary sm:text-base"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="min-w-0">
            <h3 className="font-michroma text-xs font-semibold uppercase tracking-wider text-foreground sm:text-sm">
              Resources
            </h3>
            <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
              {resourceLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block py-1 text-sm text-muted-foreground transition-colors hover:text-primary sm:text-base"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Feature */}
          <div className="min-w-0">
            <h3 className="font-michroma text-xs font-semibold uppercase tracking-wider text-foreground sm:text-sm">
              Feature
            </h3>
            <ul className="mt-4 space-y-2 sm:mt-5 sm:space-y-3">
              {featureLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block py-1 text-sm text-muted-foreground transition-colors hover:text-primary sm:text-base"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────── */}
        <div className="mt-10 flex flex-col items-center gap-4 border-t border-primary/15 pt-6 sm:mt-12 sm:pt-8 md:flex-row md:items-center md:justify-between md:pt-10">
          <p className="text-center text-xs text-muted-foreground sm:text-sm md:text-left">
            © Copyright {currentYear}, All rights Reserved by Ullas India
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-x-6 md:justify-end">
            {legalLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="block py-1 text-xs text-muted-foreground transition-colors hover:text-primary sm:text-sm"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
