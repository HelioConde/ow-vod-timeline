const { test, expect } = require("@playwright/test");

test("creates a timeline note and keeps i18n usable", async ({ page }) => {
  await page.goto("/");

  await page.locator("#timestamp").fill("01:23");
  await page.locator("#category").selectOption("teamfight");
  await page.locator("#observation").fill("Entramos sem esperar o cooldown defensivo.");
  await page.locator("#next-action").fill("Esperar o cooldown antes de avançar.");
  await page.locator("#note-form").getByRole("button", { name: "Adicionar à timeline" }).click();

  await expect(page.locator("#timeline-list")).toContainText("Entramos sem esperar o cooldown defensivo.");
  await expect(page.locator("#timeline-list")).toContainText("01:23");

  await page.locator("#language-toggle").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
