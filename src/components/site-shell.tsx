import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";

const nav = [
  { to: "/", label: "Home" },
  { to: "/principles", label: "Principles" },
  { to: "/modules", label: "Modules" },
  { to: "/november-fund", label: "November Fund" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll detection
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      setScrolled(window.scrollY > 0);
    });
  }

  // Close menu when clicking outside
  const handleMenuClose = () => {
    setOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-all ${
        scrolled
          ? "border-border bg-background/95 shadow-sm"
          : "border-border/70 bg-background/85 backdrop-blur"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label="Ubuntu Finance Society Home"
        >
          <span className="grid size-8 place-items-center rounded-md bg-ink text-ink-foreground font-display text-sm font-bold">
            U
          </span>
          <span className="font-display text-[0.95rem] font-semibold leading-tight">
            Ubuntu Finance
            <span className="block text-[0.68rem] font-medium tracking-[0.2em] uppercase text-muted-foreground">
              Society
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          {nav.slice(1).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/contact"
            className="hidden rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Request a demo
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-md border border-border transition-colors hover:bg-secondary md:hidden"
          >
            <span className="space-y-1">
              <span
                className={`block h-0.5 w-4 bg-foreground transition-transform ${
                  open ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-4 bg-foreground transition-opacity ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-4 bg-foreground transition-transform ${
                  open ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          className="border-t border-border bg-card md:hidden"
        >
          <div className="container-page flex flex-col py-2">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={handleMenuClose}
                className="rounded-md px-2 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border bg-ink text-ink-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-display text-lg font-semibold">Ubuntu Finance Society</p>
          <p className="mt-3 max-w-sm text-sm text-ink-foreground/70">
            Transparency, governance and record-keeping software for community financial
            groups. We keep the books — the group keeps the money.
          </p>
        </div>
        <nav>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-foreground/60">
            Platform
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {nav.slice(1).map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-ink-foreground/80 transition-colors hover:text-ink-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-foreground/60">
            Legal position
          </p>
          <p className="mt-4 text-sm text-ink-foreground/70">
            Ubuntu Finance Society is a Software-as-a-Service provider. It is not a bank,
            insurer, lender, investment manager or Financial Service Provider. It never
            holds, pools, routes or custodies member funds, and gives no financial advice.
          </p>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-ink-foreground/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {currentYear} Ubuntu Finance Society. All rights reserved.</p>
          <p>Software only · Zero fund custody</p>
        </div>
      </div>
    </footer>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro: string;
}) {
  return (
    <section className="border-b border-border bg-sand/60">
      <div className="container-page py-16 md:py-20">
        <p className="eyebrow text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold md:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          {intro}
        </p>
      </div>
    </section>
  );
}

export function Section({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`container-page py-14 md:py-20 ${className}`}>
      {children}
    </section>
  );
}

export function FeatureGrid({
  items,
  columns = 3,
}: {
  items: Array<{ title: string; description: string; icon?: string }>;
  columns?: 2 | 3;
}) {
  const colClass = columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid gap-4 ${colClass}`}>
      {items.map((item) => (
        <article
          key={item.title}
          className="rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-lift hover:-translate-y-1"
        >
          {item.icon && (
            <div className="text-2xl mb-2">{item.icon}</div>
          )}
          <h3 className="font-display font-semibold">{item.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
        </article>
      ))}
    </div>
  );
}
