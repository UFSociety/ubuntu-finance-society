import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, Section } from "@/components/site-shell";

export const Route = createFileRoute("/principles")({
  head: () => ({
    meta: [
      { title: "Platform Principles — Ubuntu Finance Society" },
      {
        name: "description",
        content:
          "Our non-FSP positioning, zero fund custody principle, revenue model and ledger architecture — the rules that govern everything we build.",
      },
      { property: "og:title", content: "Platform Principles — Ubuntu Finance Society" },
      {
        property: "og:description",
        content:
          "Software-as-a-Service only: no deposits, no pooling, no routing, no custody. Read the principles behind the platform.",
      },
    ],
  }),
  component: PrinciplesPage,
});

const never = [
  "Hold member funds",
  "Receive deposits",
  "Pool funds",
  "Route funds",
  "Transfer funds",
  "Custody funds",
  "Act as a bank",
  "Act as an insurer",
  "Act as an investment manager",
  "Act as a lender",
  "Make financial decisions",
];

const may = [
  "Record events",
  "Display reports",
  "Provide voting",
  "Provide governance tools",
  "Generate constitutions",
  "Provide audit logs",
  "Track contributions",
  "Track loans",
  "Track repayments",
  "Track distributions",
];

const flowSteps = [
  "Bank event",
  "Verification",
  "Webhook",
  "Ledger entry",
  "Dashboard",
];

function PrinciplesPage() {
  const [selectedPrinciple, setSelectedPrinciple] = useState<"never" | "may">("never");

  return (
    <>
      <PageHero
        eyebrow="Platform principles"
        title="Software, not a financial service"
        intro="Ubuntu Finance Society exists to improve trust, transparency, accountability, governance, reporting and auditability. It does not exist to hold money, lend money, insure members, advise, manage investments or guarantee returns."
      />

      <Section>
        <div className="mb-8">
          <p className="eyebrow text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Platform boundaries
          </p>
          <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
            What we do. What we don't.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <button
            onClick={() => setSelectedPrinciple("never")}
            className={`rounded-xl border p-6 text-left transition-all shadow-soft hover:shadow-md ${
              selectedPrinciple === "never"
                ? "border-destructive/40 bg-destructive/5"
                : "border-border bg-card"
            }`}
          >
            <p className="eyebrow text-xs font-semibold uppercase tracking-wide text-destructive">
              The platform must never
            </p>
            <div className="mt-4 space-y-2.5">
              {never.slice(0, 4).map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm">
                  <span className="mt-[7px] block h-px w-3 shrink-0 bg-destructive" />
                  <span>{item}</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">+ {never.length - 4} more restrictions</p>
            </div>
          </button>

          <button
            onClick={() => setSelectedPrinciple("may")}
            className={`rounded-xl border p-6 text-left transition-all shadow-soft hover:shadow-md ${
              selectedPrinciple === "may"
                ? "border-primary/40 bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            <p className="eyebrow text-xs font-semibold uppercase tracking-wide text-primary">
              The platform may only
            </p>
            <div className="mt-4 space-y-2.5">
              {may.slice(0, 4).map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span>{item}</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">+ {may.length - 4} more capabilities</p>
            </div>
          </button>
        </div>

        {selectedPrinciple === "never" && (
          <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/5 p-6">
            <p className="font-semibold text-destructive">All restrictions:</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
              {never.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 block h-px w-2 shrink-0 bg-destructive" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {selectedPrinciple === "may" && (
          <div className="mt-6 rounded-xl border border-primary/20 bg-primary/5 p-6">
            <p className="font-semibold text-primary">All capabilities:</p>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
              {may.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Section>

      <Section className="!pt-0">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-ink to-ink/95 p-8 text-ink-foreground shadow-lg md:p-12">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-foreground/60">
            Core principle
          </p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            Zero fund custody principle
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-ink-foreground/80 md:text-lg">
            All money movement happens directly between members, group-owned accounts and
            regulated payment providers. Payment integrations are used only for verification,
            confirmation, reconciliation and event notification — never as justification for
            holding funds. A bank event reaches the platform, becomes a ledger entry, and
            updates the dashboard. Nothing more.
          </p>
          <div className="mt-8 overflow-x-auto pb-2">
            <div className="flex items-center gap-3 min-w-max">
              {flowSteps.map((step, i, arr) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="flex-shrink-0 rounded-lg border border-ink-foreground/20 px-4 py-2 text-xs font-semibold whitespace-nowrap">
                    {step}
                  </div>
                  {i < arr.length - 1 && (
                    <div className="text-ink-foreground/40 text-lg">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="grid gap-5 md:grid-cols-2">
          <article className="rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-md">
            <div className="text-2xl mb-3">💰</div>
            <h2 className="font-display text-lg font-semibold text-foreground">Revenue model</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Revenue comes only from SaaS subscriptions, licensing fees and administration
              fees. We never take a percentage of contributions, security fees or profits,
              and we never participate in interest income or profit sharing.
            </p>
          </article>
          <article className="rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-md">
            <div className="text-2xl mb-3">📊</div>
            <h2 className="font-display text-lg font-semibold text-foreground">Ledger architecture</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Records are append-only. Entries are created, reversed or audited — never
              updated. Every balance is derived from ledger entries, and amounts are stored
              as exact decimal values, never floating-point.
            </p>
          </article>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="font-display text-sm font-semibold text-primary">Non-FSP Status</p>
            <p className="mt-3 text-sm text-muted-foreground">
              We are not regulated as a Financial Service Provider. We are a Software-as-a-Service provider only.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="font-display text-sm font-semibold text-primary">Transparent Governance</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Every decision is recorded, every approval is auditable, every member has visibility.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="font-display text-sm font-semibold text-primary">Group Control</p>
            <p className="mt-3 text-sm text-muted-foreground">
              Groups own their data, their money, their rules. We provide the tools, not the control.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
