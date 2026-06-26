import { test, expect } from "@playwright/test";

test.describe("Landing page", () => {
  test("renders hero section with CTA buttons", async ({ page }) => {
    await page.goto("/");

    // Hero heading
    await expect(
      page.getByRole("heading", { level: 1 }),
    ).toBeVisible();

    // CTAs
    const getStarted = page.getByRole("link", { name: /get started|empezar/i }).first();
    await expect(getStarted).toBeVisible();
  });

  test("navigates to /register when clicking Get started", async ({ page }) => {
    await page.goto("/");
    const cta = page.getByRole("link", { name: /get started|empezar gratis/i }).first();
    await cta.click();
    await expect(page).toHaveURL(/\/register/);
  });

  test("navigates to /login when clicking Sign in", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /sign in|iniciar/i }).first().click();
    await expect(page).toHaveURL(/\/login/);
  });

  test("renders features section with 6 cards", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: /todo lo que necesitas|everything you need/i }),
    ).toBeVisible();
  });
});
