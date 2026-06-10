import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  categories,
  bonusRanges,
  formatCHF,
  seniorityLevels,
  type Role,
} from "@/lib/salary-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Finance Salary Benchmark Switzerland 2026 — Blackbird" },
      {
        name: "description",
        content:
          "Swiss finance salary benchmarks for 2026. Pick a function and seniority to see the full base salary range, bonus and total cash for finance roles across Switzerland.",
      },
      { property: "og:title", content: "Finance Salary Benchmark Switzerland 2026" },
      {
        property: "og:description",
        content: "Pick a function, then a seniority — get the 2026 Swiss finance salary range instantly.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600&display=swap",
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
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary grid place-items-center">
              <span className="text-primary-foreground font-display text-sm font-semibold">B</span>
            </div>
            <span className="font-display text-lg">Blackbird</span>
            <span className="text-muted-foreground text-xs ml-2 hidden sm:inline">
              Talent Solutions · Switzerland
            </span>
          </div>
          <a
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
            Pick your function, then your seniority. We'll show the 2026 Swiss market range —
            base salary, bonus, and total cash — based on Blackbird's placements.
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
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <InfoTile
              title="Bonuses"
              body="5–15% for Analysts & Seniors, 15–25% for Managers, 20–40% for Heads of Function, 30–60% for CFOs."
            />
            <InfoTile
              title="Long-term incentives"
              body="Stock, RSUs or phantom shares — typically from Head of Function upward, especially in listed or PE-backed firms."
            />
            <InfoTile
              title="Benefits"
              body="Pension, mobility & lunch subsidies, hybrid work. Executive upgrades: company car, LTI, enhanced pension."
            />
          </div>
        </section>

        <p className="mt-12 text-xs text-muted-foreground max-w-3xl">
          Figures reflect annual base salaries in CHF for 2026 and are indicative only. Actual offers may
          vary by sector, location, and company size — and whether the company is listed, PE-backed, or
          family/privately owned.
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
    { n: 2, label: "Seniority" },
    { n: 3, label: "Salary" },
  ];
  return (
    <ol className="mt-10 flex items-center gap-3 text-sm">
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
              {c.roles.length} positions ·{" "}
              {formatCHF(Math.min(...c.roles.map((r) => r.min)))} –{" "}
              {formatCHF(Math.max(...c.roles.map((r) => r.max)))}
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
          <h2 className="text-2xl font-display mt-1">{category.name} · pick a seniority</h2>
          <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {category.roles.map((r) => {
          const sen = seniorityLevels.find((s) => s.key === r.level)!;
          return (
            <button
              key={r.title}
              onClick={() => onPick(r.title)}
              className="group text-left rounded-xl border border-border bg-card p-5 hover:border-primary hover:bg-primary/5 transition"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="text-xs uppercase tracking-wider text-primary">
                    {sen.label} · {sen.sub}
                  </div>
                  <div className="font-display text-xl mt-1">{r.title}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    Base salary
                  </div>
                  <div className="font-display text-lg mt-1">
                    {formatCHF(r.min)} – {formatCHF(r.max)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    avg {formatCHF(r.avg)}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
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
  const bonusMinAmt = Math.round((role.min * bonus.min) / 100);
  const bonusMaxAmt = Math.round((role.max * bonus.max) / 100);
  const totalMin = role.min + bonusMinAmt;
  const totalMax = role.max + bonusMaxAmt;
  const span = role.max - role.min;
  const avgPct = span > 0 ? ((role.avg - role.min) / span) * 100 : 50;
  const sen = seniorityLevels.find((s) => s.key === role.level)!;

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
            ← {sen.label}
          </button>
        </div>

        <div className="mt-6">
          <span className="text-xs uppercase tracking-[0.18em] text-primary">
            {category.name} · 2026
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-display">{role.title}</h2>
          <p className="text-muted-foreground text-sm mt-2 max-w-md">
            {sen.label} · {sen.sub}
          </p>
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

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <Stat
            label="Typical bonus"
            value={`${bonus.min}–${bonus.max}%`}
            sub={`${formatCHF(bonusMinAmt)} – ${formatCHF(bonusMaxAmt)} per year`}
          />
          <Stat
            label="Estimated total cash"
            value={`${formatCHF(totalMin)} – ${formatCHF(totalMax)}`}
            sub="Base + bonus, per year"
          />
        </div>

        {(role.level === "head" || role.level === "executive") && (
          <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground/90">
            <span className="text-primary font-medium">LTI eligible.</span> Stock, RSUs or phantom
            shares are typically offered at this level — especially in listed or PE-backed firms.
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <a
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

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg bg-surface border border-border p-4">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg font-display">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}

function InfoTile({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        <h3 className="text-base">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
