import { expect, test } from "@playwright/test";

test("localStorage で locale を保持し reload 後も維持", async ({ page }) => {
  await page.goto("/storage");
  await page.getByRole("combobox").selectOption("ja");
  await expect(page.getByText("Canopy i18n へようこそ")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Canopy i18n へようこそ")).toBeVisible();
});
