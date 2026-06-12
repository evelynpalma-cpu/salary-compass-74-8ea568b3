import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import {
  categories,
  bonusRanges,
  formatCHF,
  type Role,
} from "@/lib/salary-data";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Finance Salary Benchmark Switzerland 2026 · Blackbird" },
      {
        name: "description",
        content:
          "Swiss finance salary benchmarks for 2026. Pick a function and seniority to see the full base salary range, bonus and total cash for finance roles across Switzerland.",
      },
      { property: "og:title", content: "Finance Salary Benchmark Switzerland 2026" },
      {
        property: "og:description",
        content: "Pick a function, then a seniority, and get the 2026 Swiss finance salary range instantly.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: Index,
});

type Step = 1 | 2 | 3;

function Index() {
  const [categoryName, setCategoryName] = useState<string | null>(null);
  const [roleTitle, setRoleTitle] = useState<string | null>(null);

  const category = useMemo(
    () => categories.find((c) => c.name === categoryName) ?? null,
    [categoryName],
  );
  const role: Role | null = useMemo(() => {
    if (!category || !roleTitle) return null;
    return category.roles.find((r) => r.title === roleTitle) ?? null;
  }, [category, roleTitle]);

  const step: Step = !categoryName ? 1 : !roleTitle ? 2 : 3;

  return (
    <div className="min-h-screen bg-grain">
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo-blackbird.png" alt="Blackbird" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-display text-lg">Blackbird</span>
            <span className="text-muted-foreground text-xs ml-2 hidden sm:inline">
              Talent Solutions · Switzerland
            </span>
          </div>
          
            href="mailto:info@bbird.ch"
            className="text-sm text-muted-foreground hover:text-foreground transition"
          >
            info@bbird.ch
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pt-12 pb-24">
        <section className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Salary Benchmark · 2026
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
            Know what your <span className="text-gradient-gold">finance role</span> is worth in Switzerland.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl">
            Pick your function, then your role, and we'll reveal the 2026 Swiss market range:
            base salary, bonus, and total cash. Figures are based on market research, recent
            placements, and ongoing market discussions.
          </p>
        </section>

        <Stepper step={step} />

        <section className="mt-8">
          {step === 1 && (
            <FunctionStep
              onPick={(name) => {
                setCategoryName(name);
                setRoleTitle(null);
              }}
            />
          )}

          {step === 2 && category && (
            <SeniorityStep
              category={category}
              onBack={() => setCategoryName(null)}
              onPick={(title) => setRoleTitle(title)}
            />
          )}

          {step === 3 && category && role && (
            <ResultStep
              category={category}
              role={role}
              onChangeRole={() => setRoleTitle(null)}
              onChangeFunction={() => {
                setCategoryName(null);
                setRoleTitle(null);
              }}
            />
          )}
        </section>

        <section className="mt-20">
          <h2 className="text-2xl">What's typically included beyond base</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoTile
              title="Bonuses"
              tooltip="Benefit structures vary significantly by employer, industry, ownership structure and seniority level."
              body="Variable compensation is common in Switzerland and generally increases with seniority. Professional roles often receive performance bonuses of 5–20% of base salary, while senior leadership and executive roles may participate in larger annual incentive plans. Bonus levels vary significantly by industry, company size, ownership structure and business performance."
            />
            <InfoTile
              title="Long-term incentives (LTI)"
              tooltip="Benefit structures vary significantly by employer, industry, ownership structure and seniority level."
              body="Long-term incentives are typically reserved for senior leadership and executive positions. Listed companies often provide share-based plans, private equity-backed businesses may offer management participation programs, and start-ups frequently use ESOP or phantom share structures. LTIs are less common in traditional Swiss SMEs."
            />
            <InfoTile
              title="Retirement & Insurance"
              tooltip="Benefit structures vary significantly by employer, industry, ownership structure and seniority level."
              body="Swiss employers frequently differentiate themselves through enhanced pension fund contributions (BVG), executive pension plans, healthcare insurance coverage. For senior professionals, these benefits can represent a significant part of total compensation."
            />
            <InfoTile
              title="Benefits & Flexibility"
              tooltip="Benefit structures vary significantly by employer, industry, ownership structure and seniority level."
              body="Beyond compensation, employers can differentiate themselves by offering flexible working arrangements, public transport subsidies (GA/Half-fare card), professional development support, additional leave and family-related benefits. Availability varies by employer, industry and seniority."
            />
          </div>
        </section>

        <p className="mt-12 text-xs text-muted-foreground max-w-3xl">
          Compensation structures and benefits vary by company, industry, ownership structure and role level. Information shown is indicative of Swiss market practice and should not be interpreted as a guaranteed compensation package.
        </p>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-5xl px-6 py-6 text-xs text-muted-foreground flex flex-wrap gap-2 justify-between">
          <span>© Blackbird Talent Solutions · SECO-licensed recruitment company</span>
          <span>Seestrasse 185a, 8800 Thalwil · www.bbird.ch</span>
        </div>
      </footer>
    </div>
  );
}

function Stepper({ step }: { step: Step }) {
  const items = [
    { n: 1, label: "Function" },
    { n: 2, label: "Role" },
    { n: 3, label: "Salary" },
  ];
  return (
    <ol className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
      {items.map((it, i) => {
        const active = step === it.n;
        const done = step > it.n;
        return (
          <li key={it.n} className="flex items-center gap-3">
            <span
              className={
                "h-7 w-7 grid place-items-center rounded-full border text-xs font-medium transition " +
                (active
                  ? "bg-primary text-primary-foreground border-primary"
                  : done
                    ? "bg-primary/15 text-primary border-primary/40"
                    : "bg-secondary text-muted-foreground border-border")
              }
            >
              {done ? "✓" : it.n}
            </span>
            <span
              className={
                "text-sm " +
                (active ? "text-foreground" : done ? "text-primary" : "text-muted-foreground")
              }
            >
              {it.label}
            </span>
            {i < items.length - 1 && <span className="h-px w-8 bg-border" />}
          </li>
        );
      })}
    </ol>
  );
}

function FunctionStep({ onPick }: { onPick: (name: string) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-display">Choose a function</h2>
      <p className="text-sm text-muted-foreground mt-1">
        Which area of finance describes the role?
      </p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {categories.map((c) => (
          <button
            key={c.name}
            onClick={() => onPick(c.name)}
            className="group text-left rounded-xl border border-border bg-card p-5 hover:border-primary hover:bg-primary/5 transition"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg">{c.name}</span>
              <span className="text-primary text-sm opacity-0 group-hover:opacity-100 transition">
                Select →
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
            <p className="text-xs text-muted-foreground mt-3">
              {c.roles.length} positions
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function SeniorityStep({
  category,
  onBack,
  onPick,
}: {
  category: (typeof categories)[number];
  onBack: () => void;
  onPick: (title: string) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <button
            onClick={onBack}
            className="text-xs text-muted-foreground hover:text-foreground transition"
          >
            ← Change function
          </button>
          <h2 className="text-2xl font-display mt-1">{category.name} · pick a role</h2>
          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {category.roles.map((r) => (
          <button
            key={r.title}
            onClick={() => onPick(r.title)}
            className="group text-left rounded-xl border border-border bg-card p-5 hover:border-primary hover:bg-primary/5 transition"
          >
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="font-display text-xl">{r.title}</div>
              <div className="text-right">
                <span className="text-primary text-sm">
                  See 2026 salary →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultStep({
  category,
  role,
  onChangeRole,
  onChangeFunction,
}: {
  category: (typeof categories)[number];
  role: Role;
  onChangeRole: () => void;
  onChangeFunction: () => void;
}) {
  const bonus = bonusRanges[role.level];
  const span = role.max - role.min;
  const avgPct = span > 0 ? ((role.avg - role.min) / span) * 100 : 50;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-10 relative overflow-hidden">
      <div
        className="absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-30 blur-3xl pointer-events-none"
        style={{ background: "oklch(0.82 0.13 82 / 0.6)" }}
      />
      <div className="relative">
        <div className="flex flex-wrap gap-3 text-xs">
          <button
            onClick={onChangeFunction}
            className="px-3 py-1 rounded-full border border-border bg-secondary text-muted-foreground hover:text-foreground hover:border-primary/50 transition"
          >
            ← {category.name}
          </button>
          <button
            onClick={onChangeRole}
            className="px-3 py-1 rounded-full border border-border bg-secondary text-muted-foreground hover:text-foreground hover:border-primary/50 transition"
          >
            ← Change role
          </button>
        </div>

        <div className="mt-6">
          <span className="text-xs uppercase tracking-[0.18em] text-primary">
            {category.name} · 2026
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-display">{role.title}</h2>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <NumberBlock label="Minimum" value={formatCHF(role.min)} />
          <NumberBlock label="Average" value={formatCHF(role.avg)} highlight />
          <NumberBlock label="Maximum" value={formatCHF(role.max)} />
        </div>

        <div className="mt-8">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Base salary range
          </div>
          <div className="mt-3 relative h-2 rounded-full bg-secondary overflow-hidden">
            <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
            <div
              className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-foreground border-2 border-primary shadow-lg"
              style={{ left: `calc(${avgPct}% - 8px)` }}
            />
          </div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{formatCHF(role.min)}</span>
            <span>{formatCHF(role.max)}</span>
          </div>
        </div>

        <div className="mt-8">
          <Stat
            label="Typical bonus"
            value={`${bonus.min}–${bonus.max}%`}
          />
        </div>

        {(role.level === "head" || role.level === "executive") && (
          <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground/90">
            <span className="text-primary font-medium">LTI eligible.</span> Stock, RSUs or phantom
            shares are typically offered at this level, especially in listed or PE-backed firms.
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          
            href="mailto:info@bbird.ch?subject=Salary%20benchmark%20-%20talk%20to%20Blackbird"
            className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:opacity-90 transition"
          >
            Talk to a Blackbird advisor
          </a>
          <button
            onClick={onChangeFunction}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary text-secondary-foreground px-5 py-2.5 text-sm hover:border-primary/50 transition"
          >
            Benchmark another role
          </button>
        </div>
      </div>
    </div>
  );
}

function NumberBlock({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={
        "rounded-xl border p-5 " +
        (highlight
          ? "border-primary/40 bg-primary/5"
          : "border-border bg-surface")
      }
    >
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className={
          "mt-2 font-display " +
          (highlight ? "text-3xl sm:text-4xl text-gradient-gold" : "text-2xl sm:text-3xl")
        }
      >
        {value}
      </div>
      <div className="text-xs text-muted-foreground mt-1">per year · CHF</div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface border border-border p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-display">{value}</div>
    </div>
  );
}

function InfoTile({ title, body, tooltip }: { title: string; body: string; tooltip?: string }) {
  return (
    <div className="h-full flex flex-col rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        <h3 className="text-base">{title}</h3>
        {tooltip && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help ml-0.5" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{body}</p>
    </div>
  );
}
