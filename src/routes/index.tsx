import { createFileRoute, Link } from "@tanstack/react-router";
import heroImage from "@/assets/hero-community.jpg";
import { Section } from "@/components/site-shell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ubuntu Finance Society — Governance Software for Stokvels" },
      {
        name: "description",
        content:
          "Transparency, governance and record-keeping software for stokvels, burial societies, emergency funds and lending pools. Software only — never holds your money.",
      },
      { property: "og:title", content: "Ubuntu Finance Society — Governance Software for Stokvels" },
      {
        property: "og:description",
        content:
          "Track contributions, loans, votes and distributions on an append-only ledger. Your group keeps the money; we keep the record.",
      },
    ],
  }),
  component: Index,
});

const groupTypes = [
  "Savings Stokvels",
  "Burial Societies",
  "Emergency Funds",
  "Lending Pools",
  "Community Investment Clubs",
  "Rotational Savings Groups",
  "Mutual Aid Groups",
];

const outcomes = [
  {
    title: "Trust without meetings",
    body: "Every contribution, loan and approval is visible to every member, so the group does not need to gather to know where it stands.",
  },
  {
    title: "An append-only record",
    body: "Ledger entries are never edited. They are created, reversed or audited — balances are always derived from the entries themselves.",
  },
  {
    title: "Governance in writing",
    body: "Constitutions, voting rules, loan rules and distribution rules live in the platform and are applied consistently.",
  },
];

const featureTests = [
  ["Does it touch money?", "If yes — legal review."],
  ["Does it make financial decisions?", "If yes — legal review."],
  ["Does it earn from member funds?", "If yes — legal review."],
];

const commandCentreItems = [
  "Track contributions across every group",
  "See loans, obligations and repayment schedules",
  "Follow distributions and payout dates",
  "Vote on resolutions without a physical meeting",
];

function Index() {
  return (
    <>
      <section className="border-b border-border bg-sand/50">
        <div className="container-page grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="eyebrow">Community finance, properly recorded</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.05] md:text-6xl">
              The group keeps the money.
              <span className="block text-primary">We keep the record.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Ubuntu Finance Society is transparency, governance and administration software
              for community financial groups — stokvels, burial societies, emergency funds
              and lending pools. It records events, produces reports and holds the audit
              trail. It never holds, pools or moves a single rand.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-opacity hover:opacity-90"
              >
                Request a demo
              </Link>
              <Link
                to="/principles"
                className="rounded-md border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                Read our principles
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-border shadow-lift">
              <img
                src={heroImage}
                alt="Members of a community savings group reviewing contribution ledgers together"
                width={1600}
                height={1104}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-4 right-4 rounded-lg border border-border bg-card p-4 shadow-soft sm:left-8 sm:right-auto sm:max-w-xs">
              <p className="eyebrow">Zero fund custody</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Money moves between members, group-owned accounts and regulated payment
                providers — never through us.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section>
        <p className="eyebrow">Built for</p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {groupTypes.map((g) => (
            <span
              key={g}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
            >
              {g}
            </span>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="grid gap-5 md:grid-cols-3">
          {outcomes.map((o) => (
            <article
              key={o.title}
              className="rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-md"
            >
              <h2 className="font-display text-lg font-semibold">{o.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{o.body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="rounded-2xl border border-border bg-ink p-8 text-ink-foreground shadow-lg md:p-12">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-foreground/60">
            The test we apply to every feature
          </p>
          <h2 className="mt-4 max-w-3xl text-2xl font-semibold md:text-3xl">
            If Ubuntu Finance Society disappeared tomorrow, your group would carry on.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-foreground/75 md:text-base">
            Members can still contribute. Loans still exist. Repayments still exist. The
            group bank account still operates. All the group loses is visibility and
            administration. Any feature that breaks that principle is flagged for legal
            review before it is built.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {featureTests.map(([q, a]) => (
              <div key={q} className="rounded-lg border border-ink-foreground/15 p-4">
                <p className="text-sm font-semibold">{q}</p>
                <p className="mt-1 text-xs text-ink-foreground/65">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow">The problem</p>
            <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
              Most people belong to more than one group
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
              A burial society here, a savings stokvel there, an emergency fund at work.
              Contributions get lost in chat groups, loan balances live in one person's
              notebook, and nobody can answer simple questions without calling a meeting.
              The Personal Command Centre gives each member one private dashboard across
              every group they belong to.
            </p>
          </div>
          <ul className="grid gap-3 self-center">
            {commandCentreItems.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 text-sm transition-all hover:shadow-md"
              >
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-soft hover:shadow-md transition-all md:p-12">
          <p className="eyebrow">In practice</p>
          <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
            The November Emergency Fund
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Seven founding members, monthly contributions, member borrowing repaid with an
            agreed 20% security fee, and a single distribution on 1 November 2027 — all of
            it recorded, approved and auditable.
          </p>
          <Link
            to="/november-fund"
            className="mt-6 inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft transition-opacity hover:opacity-90"
          >
            See how it works
          </Link>
        </div>
      </Section>
    </>
  );
}
