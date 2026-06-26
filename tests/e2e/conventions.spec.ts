import { test, expect } from "@playwright/test";

test.describe("App router conventions", () => {
  test("/unknown-route renders 404 page", async ({ page }) => {
    await page.goto("/this-does-not-exist");
    await expect(page.getByText("404")).toBeVisible();
  });

  test("/sitemap.xml returns valid sitemap", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    const content = await response?.text();
    expect(content).toContain("<urlset");
    expect(content).toContain("<url>");
  });

  test("/robots.txt allows public routes and blocks /dashboard", async ({ page }) => {
    const response = await page.goto("/robots.txt");
    expect(response?.status()).toBe(200);
    const content = await response?.text();
    expect(content).toContain("User-agent: *");
    expect(content).toContain("Disallow: /dashboard");
  });

  test("/manifest.json returns valid webmanifest", async ({ page }) => {
    const response = await page.goto("/manifest.webmanifest");
    expect(response?.status()).toBe(200);
    const body = await response?.json();
    expect(body.name).toBeDefined();
    expect(body.start_url).toBe("/");
  });
});
