import { bonusRanges, categories } from "./salary-data";

const datasetIdentity = {
  creator: {
    "@type": "Organization",
    name: "Blackbird Talent Solutions",
    url: "https://bbird.ch",
  },
  inLanguage: "en",
  license: "https://creativecommons.org/licenses/by/4.0/",
};

export function createSalaryDataset() {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Swiss Finance Salary Benchmark 2026",
    description: "Indicative annual base salary ranges and typical bonus percentages for finance roles in Switzerland, by function and role, compiled by Blackbird Talent Solutions.",
    ...datasetIdentity,
    url: "https://salaries.bbird.ch",
    publisher: {
      "@type": "Organization",
      name: "Blackbird Talent Solutions",
      url: "https://www.bbird.ch",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Seestrasse 185a",
        addressLocality: "Thalwil",
        postalCode: "8800",
        addressCountry: "CH",
      },
    },
    temporalCoverage: "2026",
    spatialCoverage: "Switzerland",
    keywords: ["finance salary", "Switzerland", "CFO", "FP&A", "Controlling", "Treasury", "Tax", "Audit", "Accounting", "salary benchmark", "2026"],
    hasPart: categories.map((category) => ({
      "@type": "Dataset",
      name: `${category.name} salaries in Switzerland 2026`,
      description: `Indicative annual base salaries in CHF and typical bonus ranges for ${category.name} roles in Switzerland in 2026: ${category.roles.slice(0, -1).map((role) => role.title).join(", ")} and ${category.roles.at(-1)?.title}.`,
      ...datasetIdentity,
      hasPart: category.roles.map((role) => ({
        "@type": "Dataset",
        name: `${role.title} annual base salary in Switzerland 2026`,
        description: `Indicative annual base salary in CHF for ${role.title} in Switzerland. Typical bonus is a percentage of base salary and is not included in the base figures.`,
        ...datasetIdentity,
        variableMeasured: [
          { "@type": "PropertyValue", name: "Minimum annual base salary", value: role.min, unitText: "CHF per year" },
          { "@type": "PropertyValue", name: "Average annual base salary", value: role.avg, unitText: "CHF per year" },
          { "@type": "PropertyValue", name: "Maximum annual base salary", value: role.max, unitText: "CHF per year" },
          { "@type": "PropertyValue", name: "Typical bonus minimum", value: bonusRanges[role.level].min, unitText: "percent of base salary" },
          { "@type": "PropertyValue", name: "Typical bonus maximum", value: bonusRanges[role.level].max, unitText: "percent of base salary" },
        ],
      })),
    })),
  };
}