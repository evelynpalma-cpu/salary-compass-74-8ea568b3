import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { categories, bonusRanges, formatCHF, type Role } from "@/lib/salary-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Finance & Accounting Salary Benchmark — Switzerland" },
      {
        name: "description",
        content:
          "Get instant salary estimates for Finance & Accounting roles in Switzerland. Pick your role and see min, average and max base salary plus bonus expectations.",
      },
      { property: "og:title", content: "Finance & Accounting Salary Benchmark — Switzerland" },
      {
        property: "og:description",
        content: "Pick a Finance role and get a salary estimation built on Blackbird's Swiss market data.",
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

function Index() {
  const [categoryName, setCategoryName] = useState(categories[0].name);
  const category = categories.find((c) => c.name === categoryName)!;
  const [roleTitle, setRoleTitle] = useState<string>(category.roles[0].title);

  const role: Role = useMemo(() => {
    const c = categories.find((c) => c.name === categoryName)!;
    return c.roles.find((r) => r.title === roleTitle) ?? c.roles[0];
  }, [categoryName, roleTitle]);

  const bonus = bonusRanges[role.level];
  const totalMin = role.min + Math.round((role.min * bonus.min) / 100);
  const totalMax = role.max + Math.round((role.max * bonus.max) / 100);

  return (
    <div className="min-h-screen bg-grain">
      <header className="border-b border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
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

      <main className="mx-auto max-w-6xl px-6 pt-14 pb-24">
        <section className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Salary Benchmark · 2025
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
            Know what your <span className="text-gradient-gold">finance role</span> is worth in Switzerland.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl">
            Pick a function and a position. We'll show you the Swiss market range for base salary, plus typical
            bonus and total cash compensation — based on Blackbird's placements across Accounting, Controlling,
            FP&A, Audit, Tax, Treasury and Finance leadership.
          </p>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1.05fr_1.4fr]">
          <Picker
            categoryName={categoryName}
            roleTitle={roleTitle}
            onCategory={(name) => {
              setCategoryName(name);
              const c = categories.find((c) => c.name === name)!;
              setRoleTitle(c.roles[0].title);
            }}
            onRole={setRoleTitle}
          />
          <ResultCard
            role={role}
            categoryName={categoryName}
            categoryDescription={category.description}
            bonus={bonus}
            totalMin={totalMin}
            totalMax={totalMax}
          />
        </section>

        <section className="mt-16">
          <h2 className="text-2xl">What's typically included beyond base</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <InfoTile
              title="Bonuses"
              body="5–15% for Analysts & Seniors, 15–25% for Managers, 20–40% for Heads of Function, and 30–60% for CFOs."
            />
            <InfoTile
              title="Long-term incentives"
              body="Stock, RSUs or phantom shares — typically from Head of Function level upward, especially in listed or PE-backed firms."
            />
            <InfoTile
              title="Benefits"
              body="Pension, mobility & lunch subsidies, hybrid work. Executive upgrades: company car, LTI, enhanced pension."
            />
          </div>
        </section>

        <p className="mt-12 text-xs text-muted-foreground max-w-3xl">
          Figures reflect base salaries in CHF and are indicative only. Actual offers may vary by sector,
          location, and company size — and whether the company is listed, PE-backed, or family/privately
          owned.
        </p>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-muted-foreground flex flex-wrap gap-2 justify-between">
          <span>© Blackbird Talent Solutions · SECO-licensed recruitment company</span>
          <span>Seestrasse 185a, 8800 Thalwil · www.bbird.ch</span>
        </div>
      </footer>
    </div>
  );
}

function Picker({
  categoryName,
  roleTitle,
  onCategory,
  onRole,
}: {
  categoryName: string;
  roleTitle: string;
  onCategory: (n: string) => void;
  onRole: (n: string) => void;
}) {
  const category = categories.find((c) => c.name === categoryName)!;
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-display">Find your benchmark</h2>
      <p className="text-sm text-muted-foreground mt-1">Two clicks. No sign-up.</p>

      <div className="mt-6">
        <label className="text-xs uppercase tracking-wider text-muted-foreground">1 · Function</label>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = c.name === categoryName;
            return (
              <button
                key={c.name}
                onClick={() => onCategory(c.name)}
                className={
                  "px-3 py-1.5 rounded-full text-sm border transition " +
                  (active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-secondary-foreground border-border hover:border-primary/50")
                }
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <label className="text-xs uppercase tracking-wider text-muted-foreground">2 · Position</label>
        <div className="mt-3 grid gap-2">
          {category.roles.map((r) => {
            const active = r.title === roleTitle;
            return (
              <button
                key={r.title}
                onClick={() => onRole(r.title)}
                className={
                  "text-left px-4 py-3 rounded-lg border transition flex items-center justify-between " +
                  (active
                    ? "border-primary bg-primary/10"
                    : "border-border bg-surface hover:border-primary/40")
                }
              >
                <span className="text-sm font-medium">{r.title}</span>
                <span className="text-xs text-muted-foreground">{formatCHF(r.avg)} avg</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ResultCard({
  role,
  categoryName,
  categoryDescription,
  bonus,
  totalMin,
  totalMax,
}: {
  role: Role;
  categoryName: string;
  categoryDescription: string;
  bonus: { min: number; max: number; label: string };
  totalMin: number;
  totalMax: number;
}) {
  const span = role.max - role.min;
  const avgPct = ((role.avg - role.min) / span) * 100;

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8 relative overflow-hidden">
      <div
        className="absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
        style={{ background: "oklch(0.82 0.13 82 / 0.6)" }}
      />
      <div className="relative">
        <span className="text-xs uppercase tracking-[0.18em] text-primary">
          {categoryName}
        </span>
        <h2 className="mt-2 text-3xl sm:text-4xl">{role.title}</h2>
        <p className="text-muted-foreground text-sm mt-2 max-w-md">{categoryDescription}</p>

        <div className="mt-8">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Base salary range
          </div>
          <div className="mt-3 flex items-baseline gap-3 flex-wrap">
            <span className="text-4xl sm:text-5xl text-gradient-gold font-display">
              {formatCHF(role.avg)}
            </span>
            <span className="text-sm text-muted-foreground">average · per year</span>
          </div>

          <div className="mt-6">
            <div className="relative h-2 rounded-full bg-secondary overflow-hidden">
              <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />
              <div
                className="absolute top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-foreground border-2 border-primary shadow-lg"
                style={{ left: `calc(${avgPct}% - 8px)` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Min · {formatCHF(role.min)}</span>
              <span>Max · {formatCHF(role.max)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          <Stat
            label="Typical bonus"
            value={`${bonus.min}–${bonus.max}%`}
            sub={bonus.label}
          />
          <Stat
            label="Estimated total cash"
            value={`${formatCHF(totalMin)} – ${formatCHF(totalMax)}`}
            sub="Base + bonus range"
          />
        </div>

        {(role.level === "head" || role.level === "executive") && (
          <div className="mt-6 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-foreground/90">
            <span className="text-primary font-medium">LTI eligible.</span> Stock, RSUs or phantom
            shares are typically offered at this level — especially in listed or PE-backed firms.
          </div>
        )}
      </div>
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
