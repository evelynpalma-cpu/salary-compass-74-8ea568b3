import { expect, test } from "bun:test";
import { bonusRanges, categories } from "./salary-data";
import { createSalaryDataset } from "./salary-schema";

const schema = createSalaryDataset();
const datasets = [schema, ...schema.hasPart.flatMap((category) => [category, ...category.hasPart])];

test("every Dataset has a name and description specific to its contents", () => {
  for (const dataset of datasets) {
    expect(dataset.name.length).toBeGreaterThan(0);
    expect(dataset.description.length).toBeGreaterThan(0);
    expect(dataset.description).toContain("Switzerland");
  }
  schema.hasPart.forEach((dataset, index) => {
    expect(dataset.description).toContain(categories[index].name);
    dataset.hasPart.forEach((role, roleIndex) => {
      expect(role.description).toContain(categories[index].roles[roleIndex].title);
    });
  });
});

test("every Dataset identifies Blackbird Talent Solutions as creator", () => {
  for (const dataset of datasets) {
    expect(dataset.creator).toEqual({ "@type": "Organization", name: "Blackbird Talent Solutions", url: "https://bbird.ch" });
  }
});

test("every Dataset uses the page's English language", () => {
  for (const dataset of datasets) expect(dataset.inLanguage).toBe("en");
});

test("no Dataset invents an update date, sample size or licence", () => {
  for (const dataset of datasets) {
    for (const field of ["dateModified", "dateCreated", "datePublished", "license", "sampleSize", "measurementTechnique"]) {
      expect(dataset).not.toHaveProperty(field);
    }
  }
});

test("serialized salary figures remain identical to the visible salary source", () => {
  const parsed = JSON.parse(JSON.stringify(schema));
  expect(parsed.hasPart.length).toBe(categories.length);
  categories.forEach((category, index) => {
    expect(parsed.hasPart[index].hasPart.length).toBe(category.roles.length);
    category.roles.forEach((role, roleIndex) => {
      expect(parsed.hasPart[index].hasPart[roleIndex].variableMeasured.map((value: { value: number }) => value.value)).toEqual([
        role.min, role.avg, role.max, bonusRanges[role.level].min, bonusRanges[role.level].max,
      ]);
    });
  });
});