import { expect, test } from "@playwright/test";

test("URL hash で locale が反映される", async ({ page }) => {
  await page.goto("/hash#zh");
  await expect(page.getByText("欢迎使用 Canopy i18n")).toBeVisible();
});

test("Switcher で hash が書き換わる", async ({ page }) => {
  await page.goto("/hash");
  await page.getByRole("combobox").selectOption("ja");
  await expect(page).toHaveURL(/#ja$/);
  await expect(page.getByText("Canopy i18n へようこそ")).toBeVisible();
});
