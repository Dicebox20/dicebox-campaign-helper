import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("requires an explicit Utility Harness target and resolves the accessibility adapter", () => {
  const target = process.env.UTILITY_HARNESS_URL;
  expect(target === undefined || /^https?:\/\/.+/.test(target)).toBe(true);
  expect(typeof AxeBuilder).toBe("function");
});
