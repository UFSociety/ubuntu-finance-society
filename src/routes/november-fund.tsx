import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, Section } from "@/components/site-shell";

export const Route = createFileRoute("/november-fund")({
  head: () => ({
    meta: [
      { title: "November Emergency Fund — Ubuntu Finance Society" },
      {
        name: "description",
        content:
          "Seven founding members, monthly contributions, member borrowing with no interest/security fee, financial year in November — fully recorded and auditable.",
      },
      { property: "og:title", content: "November Emergency Fund — Ubuntu Finance Society" },
      {
        property: "og:description",
        content:
          "A worked example of how a community emergency fund runs on Ubuntu Finance Society.",
      },
    ],
  }),
  component: NovemberFundPage,
});

const members = [
  "Madlala",
  "Thusi",
  "MaGumede",
  "Sifuso Nkhumalo",
  "David Mgadi",
  "Sbonis Shandu",
  "Ntokozo Zulu",
];

const rules = [
  "Members contribute monthly on an agreed date.",
  "Members may borrow from the pool subject to approval.",
  "Borrowers repay the principal with no interest or security fee.",
  "Society chooses pool growth and distribution strategies.",
  "Distribution occurs on 1 November yearly.",
  "Every action is recorded in the append-only ledger.",
  "Every approval is auditable and attributable.",
  "Every member has full visibility at all times.",
];

const lifecycle = [
  {
    step: "Contribution recorded",
    detail: "A member pays the group account. The payment is confirmed and written to the ledger.",
    icon: "💳",
  },
  {
    step: "Loan requested",
    detail: "A member submits a request against the pool with an amount and reason.",
    icon: "🙋",
  },
  {
    step: "Approval voted",
    detail: "Approvers act under the constitution; the decision and voters are logged.",
    icon: "✓",
  },
  {
    step: "Repayment tracked",
    detail: "Principal plus the 0% security fee is scheduled and marked off as it arrives.",
    icon: "📊",
  },
  {
    step: "Distribution",
    detail: "On 1 November 2027 each member's share is calculated from ledger entries.",
    icon: "🎉",
  },
];

const fundSnapshot = [
  ["Purpose", "Short-term emergency finance for members"],
  ["Contribution cycle", "Monthly"],
  ["Security fee", "None — members repay principal only"],
  ["Distribution date", "1 November 2027"],
  ["Record keeper", "Append-only ledger with full audit trail"],
  ["Fund holder", "The group (not Ubuntu Finance Society)"],
];

function NovemberFundPage() {
  const [expandedRule, setExpandedRule] = useState<number | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Worked example"
        title="The November Emergency Fund"
        intro="A short-term emergency finance pool for its seven founding members — the model that shaped the platform. The fund holds its own money; Ubuntu Finance Society holds its record."
      />

      <Section>
        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="eyebrow text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Founding members
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {members.map((m, i) => (
                <li
                  key={m}
                  className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium transition-all hover:shadow-md hover:border-primary/50"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate">{m}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-border bg-gradient-to-br from-sand/60 to-sand/40 p-6">
            <p className="eyebrow text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Fund at a glance
            </p>
            <dl className="mt-4 space-y-4 text-sm">
              {fundSnapshot.map(([k, v], idx) => (
                <div
                  key={k}
                  className={`pb-4 ${idx !== fundSnapshot.length - 1 ? "border-b border-border/50" : ""}`}
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {k}
                  </dt>
                  <dd className="mt-2 font-medium text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="mb-8">
          <p className="eyebrow text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Fund governance
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Eight rules that keep it transparent</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {rules.map((r, idx) => (
            <button
              key={r}
              onClick={() => setExpandedRule(expandedRule === idx ? null : idx)}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-left transition-all hover:shadow-md hover:border-primary/50"
            >
              <span className="mt-1.5 flex size-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {idx + 1}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug text-foreground">{r}</p>
              </div>
            </button>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <p className="eyebrow text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          How it works
        </p>
        <h2 className="mt-2 mb-8 text-2xl font-semibold">Five phases of record-keeping</h2>

        <div className="space-y-3">
          {lifecycle.map((l, i) => (
            <div
              key={l.step}
              className="flex gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md"
            >
              <div className="flex flex-shrink-0 items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/10" />
                  <div className="relative flex size-12 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground font-semibold">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <p className="font-display text-base font-semibold text-foreground">
                  {l.icon} {l.step}
                </p>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{l.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-ink to-ink/95 p-8 text-ink-foreground shadow-lg md:p-12">
          <div className="flex flex-col gap-2 mb-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink-foreground/60">
              Ready to get started?
            </span>
          </div>
          <h2 className="text-3xl font-semibold md:text-4xl">
            Want this record for your group?
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-foreground/80 md:text-lg">
            The same structure works for a burial society, a savings stokvel, a lending pool or
            an investment club. Tell us how your group runs and we will show you the record it
            would keep in Ubuntu Finance Society.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-ink shadow-soft transition-opacity hover:opacity-90"
            >
              Request a demo
            </Link>
            <Link
              to="/principles"
              className="inline-flex items-center justify-center rounded-md border border-ink-foreground/30 px-6 py-3 text-sm font-semibold text-ink-foreground transition-colors hover:bg-ink-foreground/10"
            >
              Learn our principles
            </Link>
          </div>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="rounded-xl border border-border bg-blue-50 dark:bg-blue-900/20 p-6">
          <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
            💡 Tip: All member activity is auditable
          </p>
          <p className="mt-2 text-sm text-blue-800 dark:text-blue-200">
            Every contribution, loan decision, and repayment in the November Emergency Fund is
            recorded with timestamps, voter identities, and reasoning. This creates a complete
            audit trail that the group can reference at any time.
          </p>
        </div>
      </Section>
    </>
  );
}
