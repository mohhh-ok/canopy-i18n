import { expect, test } from "@playwright/test";

test("/pathname/{locale} で locale が反映される", async ({ page }) => {
  await page.goto("/pathname/zh");
  await expect(page.getByText("欢迎使用 Canopy i18n")).toBeVisible();
});

test("Switcher で path に locale segment が入る", async ({ page }) => {
  await page.goto("/pathname");
  await page.getByRole("combobox").selectOption("ja");
  await expect(page).toHaveURL(/\/pathname\/ja\b/);
  await expect(page.getByText("Canopy i18n へようこそ")).toBeVisible();
});
