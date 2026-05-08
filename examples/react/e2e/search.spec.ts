import { expect, test } from "@playwright/test";

test("?lang= で locale が反映される", async ({ page }) => {
  await page.goto("/search?lang=zh");
  await expect(page.getByText("欢迎使用 Canopy i18n")).toBeVisible();
});

test("Switcher で ?lang= が書き換わる", async ({ page }) => {
  await page.goto("/search");
  await page.getByRole("combobox").selectOption("ja");
  await expect(page).toHaveURL(/[?&]lang=ja\b/);
  await expect(page.getByText("Canopy i18n へようこそ")).toBeVisible();
});
