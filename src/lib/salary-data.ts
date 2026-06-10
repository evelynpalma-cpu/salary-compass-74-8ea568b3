export type Role = {
  title: string;
  min: number;
  avg: number;
  max: number;
  level: "analyst" | "senior" | "manager" | "head" | "executive";
};

export type Category = {
  name: string;
  description: string;
  roles: Role[];
};

export const categories: Category[] = [
  {
    name: "Accounting",
    description: "Statutory & group accounting, IFRS/local GAAP, consolidation.",
    roles: [
      { title: "Accountant", min: 85000, avg: 97500, max: 110000, level: "analyst" },
      { title: "Senior Accountant", min: 105000, avg: 115000, max: 125000, level: "senior" },
      { title: "Accounting Manager", min: 130000, avg: 145000, max: 160000, level: "manager" },
      { title: "Head of Accounting", min: 150000, avg: 175000, max: 200000, level: "head" },
    ],
  },
  {
    name: "Controlling",
    description: "Internal performance management, cost control, financial steering.",
    roles: [
      { title: "Controller", min: 90000, avg: 105000, max: 120000, level: "analyst" },
      { title: "Senior Controller", min: 110000, avg: 125000, max: 140000, level: "senior" },
      { title: "Controlling Manager", min: 140000, avg: 150000, max: 160000, level: "manager" },
      { title: "Head of Controlling", min: 160000, avg: 195000, max: 230000, level: "head" },
    ],
  },
  {
    name: "FP&A",
    description: "Forecasting, budgeting, strategic planning, performance dashboards.",
    roles: [
      { title: "FP&A Analyst", min: 95000, avg: 110000, max: 125000, level: "analyst" },
      { title: "Senior FP&A Analyst", min: 115000, avg: 125000, max: 135000, level: "senior" },
      { title: "FP&A Manager", min: 150000, avg: 165000, max: 180000, level: "manager" },
      { title: "Head of FP&A", min: 200000, avg: 230000, max: 260000, level: "head" },
    ],
  },
  {
    name: "Audit",
    description: "Internal controls, risk assurance, SOX, process audits, compliance.",
    roles: [
      { title: "Internal Auditor", min: 90000, avg: 100000, max: 110000, level: "analyst" },
      { title: "Senior Auditor", min: 105000, avg: 115000, max: 125000, level: "senior" },
      { title: "Audit Manager", min: 120000, avg: 135000, max: 150000, level: "manager" },
      { title: "Head of Internal Audit", min: 180000, avg: 215000, max: 250000, level: "head" },
    ],
  },
  {
    name: "Tax",
    description: "Corporate & international tax planning, transfer pricing, VAT.",
    roles: [
      { title: "Tax Analyst", min: 95000, avg: 105000, max: 115000, level: "analyst" },
      { title: "Senior Tax Analyst", min: 110000, avg: 120000, max: 130000, level: "senior" },
      { title: "Tax Manager", min: 140000, avg: 160000, max: 180000, level: "manager" },
      { title: "Head of Tax", min: 200000, avg: 245000, max: 280000, level: "head" },
    ],
  },
  {
    name: "Treasury",
    description: "Liquidity, cash management, FX hedging, capital structure.",
    roles: [
      { title: "Treasury Analyst", min: 90000, avg: 100000, max: 110000, level: "analyst" },
      { title: "Senior Treasury Analyst", min: 115000, avg: 125000, max: 135000, level: "senior" },
      { title: "Treasury Manager", min: 150000, avg: 165000, max: 180000, level: "manager" },
      { title: "Head of Treasury", min: 220000, avg: 260000, max: 300000, level: "head" },
    ],
  },
  {
    name: "Finance Leadership",
    description: "Senior leadership roles overseeing finance functions end-to-end.",
    roles: [
      { title: "Finance Manager", min: 140000, avg: 150000, max: 160000, level: "manager" },
      { title: "Head of Finance", min: 180000, avg: 220000, max: 260000, level: "head" },
      { title: "BU CFO (BU/Subsidiary)", min: 220000, avg: 260000, max: 300000, level: "executive" },
      { title: "Group CFO", min: 280000, avg: 340000, max: 400000, level: "executive" },
    ],
  },
];

export const bonusRanges: Record<Role["level"], { min: number; max: number; label: string }> = {
  analyst: { min: 5, max: 15, label: "Analyst / Junior" },
  senior: { min: 5, max: 15, label: "Senior individual contributor" },
  manager: { min: 15, max: 25, label: "Manager" },
  head: { min: 20, max: 40, label: "Head of Function" },
  executive: { min: 30, max: 60, label: "CFO / Executive" },
};

export function formatCHF(n: number): string {
  // Manual thousands separator with apostrophe (Swiss convention) — locale-independent
  // to avoid SSR/client hydration mismatches.
  const s = Math.round(n).toString();
  const withSep = s.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
  return `CHF ${withSep}`;
}

export const seniorityLevels: { key: Role["level"]; label: string; sub: string }[] = [
  { key: "analyst", label: "Junior / Analyst", sub: "0–3 years" },
  { key: "senior", label: "Senior IC", sub: "3–7 years" },
  { key: "manager", label: "Manager", sub: "5–10 years, team lead" },
  { key: "head", label: "Head of Function", sub: "10+ years" },
  { key: "executive", label: "Executive / CFO", sub: "C-level" },
];
