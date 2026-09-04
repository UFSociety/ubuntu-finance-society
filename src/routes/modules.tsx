import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, Section } from "@/components/site-shell";

export const Route = createFileRoute("/modules")({
  head: () => ({
    meta: [
      { title: "Platform Modules — Ubuntu Finance Society" },
      {
        name: "description",
        content:
          "Groups, constitutions, contributions, lending pools, voting, announcements, an append-only ledger, reports and a Personal Command Centre.",
      },
      { property: "og:title", content: "Platform Modules — Ubuntu Finance Society" },
      {
        property: "og:description",
        content:
          "Ten modules covering governance, contributions, lending, voting, ledger and reporting for community financial groups.",
      },
    ],
  }),
  component: ModulesPage,
});

const modules = [
  {
    n: "01",
    title: "Authentication",
    description: "Secure access control and role management",
    items: ["Registration", "Login", "Role management", "Multi-factor authentication"],
  },
  {
    n: "02",
    title: "Groups",
    description: "Create and manage community financial groups",
    items: ["Create group", "Join group", "Manage group", "Invitations"],
  },
  {
    n: "03",
    title: "Constitutions",
    description: "Define rules and governance structures",
    items: ["Constitution builder", "Governance rules", "Voting rules", "Loan & distribution rules"],
  },
  {
    n: "04",
    title: "Contributions",
    description: "Track member contributions transparently",
    items: ["Contribution tracking", "Contribution history", "Contribution reports"],
  },
  {
    n: "05",
    title: "Lending Pools",
    description: "Manage loans and repayments",
    items: ["Loan requests", "Loan approvals", "Loan tracking", "Repayment tracking"],
  },
  {
    n: "06",
    title: "Voting",
    description: "Democratic decision-making and amendments",
    items: ["Polls", "Resolutions", "Constitutional amendments"],
  },
  {
    n: "07",
    title: "Announcements",
    description: "Communicate group updates to all members",
    items: ["Notice board", "Read receipts", "Group updates"],
  },
  {
    n: "08",
    title: "Ledger",
    description: "Immutable record of all financial activity",
    items: ["Append-only ledger", "Audit trail", "Immutable records"],
  },
  {
    n: "09",
    title: "Reports",
    description: "Generate financial reports and summaries",
    items: ["Monthly reports", "Annual reports", "Distribution reports"],
  },
  {
    n: "10",
    title: "Personal Command Centre",
    description: "One dashboard for all groups and obligations",
    items: ["One private dashboard", "Every group in one place", "Obligations at a glance"],
  },
];

const fundTypes = [
  {
    title: "Savings Pool",
    body: "Fixed contributions held by the group, distributed at an agreed future date.",
    icon: "💰",
    groupTypes: ["Stokvels", "Investment Clubs"],
  },
  {
    title: "Emergency Fund",
    body: "Contributions recorded and made available to members for emergencies.",
    icon: "🆘",
    groupTypes: ["Mutual Aid Groups"],
  },
  {
    title: "Burial Society",
    body: "Event-triggered contributions and beneficiary support, fully documented.",
    icon: "🕊️",
    groupTypes: ["Burial Societies"],
  },
  {
    title: "Lending Pool",
    body: "Members contribute, borrow and repay with an agreed fee that grows the pool.",
    icon: "🔄",
    groupTypes: ["Lending Circles"],
  },
];

function ModulesPage() {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [selectedFundType, setSelectedFundType] = useState<string | null>(null);

  return (
    <>
      <PageHero
        eyebrow="Core platform"
        title="Ten modules, one record of truth"
        intro="Each module records what the group decides and does. None of them move money — they document it, report on it and make it auditable."
      />

      <Section>
        <div className="mb-8">
          <p className="eyebrow">All modules work together</p>
          <p className="mt-2 text-lg text-muted-foreground">
            Click on any module to see what's included
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <button
              key={m.n}
              onClick={() => setExpandedModule(expandedModule === m.n ? null : m.n)}
              className="rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:shadow-lift hover:-translate-y-1 text-left"
            >
              <p className="font-display text-sm font-semibold text-ochre">{m.n}</p>
              <h2 className="mt-1 font-display text-lg font-semibold">{m.title}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
              {expandedModule === m.n && (
                <ul className="mt-4 space-y-1.5 border-t border-border/50 pt-4 text-sm text-muted-foreground">
                  {m.items.map((i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-primary">•</span>
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
              )}
            </button>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="mb-10">
          <p className="eyebrow">Special fund types</p>
          <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
            Configured to how your group already works
          </h2>
          <p className="mt-2 text-muted-foreground">
            Select a fund type to see how Ubuntu Finance Society adapts to your group's structure.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          {fundTypes.map((f) => (
            <button
              key={f.title}
              onClick={() => setSelectedFundType(selectedFundType === f.title ? null : f.title)}
              className={`rounded-xl border p-6 text-left transition-all ${
                selectedFundType === f.title
                  ? "border-primary bg-primary/5 shadow-md"
                  : "border-border bg-sand/50 hover:bg-sand/70"
              }`}
            >
              <div className="text-3xl mb-2">{f.icon}</div>
              <h3 className="font-display text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              {selectedFundType === f.title && (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Ideal for
                  </p>
                  <ul className="mt-2 space-y-1 text-sm">
                    {f.groupTypes.map((gt) => (
                      <li key={gt} className="text-foreground">
                        {gt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </button>
          ))}
        </div>
      </Section>

      <Section className="!pt-0">
        <div className="rounded-xl border border-border bg-gradient-to-br from-sand/60 to-sand/30 p-8">
          <h2 className="font-display text-2xl font-semibold">
            Ready to see your group's record?
          </h2>
          <p className="mt-3 text-muted-foreground">
            Each module works with the others to create a complete picture of your group's
            finances, governance, and obligations. Request a demo to see how we'd structure
            your specific group's record.
          </p>
        </div>
      </Section>
    </>
  );
}
