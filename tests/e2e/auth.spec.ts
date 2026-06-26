import { test, expect } from "@playwright/test";

test.describe("Auth pages", () => {
  test("login page renders Magic Link + OAuth buttons", async ({ page }) => {
    await page.goto("/login");

    // OAuth buttons
    await expect(
      page.getByRole("button", { name: /google/i }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /github/i }),
    ).toBeVisible();

    // Magic Link form
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /magic link/i }),
    ).toBeVisible();
  });

  test("register page renders same OAuth + Magic Link", async ({ page }) => {
    await page.goto("/register");

    await expect(
      page.getByRole("button", { name: /google/i }),
    ).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
  });

  test("Magic Link form shows success alert in demo mode", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/email/i).fill("test@example.com");
    await page.getByRole("button", { name: /magic link/i }).click();

    // En modo demo, el stub de Supabase responde OK → muestra alerta de "revisa tu correo"
    await expect(
      page.getByText(/revisa tu correo|check your email/i),
    ).toBeVisible({ timeout: 5000 });
  });

  test("links between login and register work", async ({ page }) => {
    await page.goto("/login");
    await page.getByRole("link", { name: /regístrate|sign up/i }).click();
    await expect(page).toHaveURL(/\/register/);

    await page.getByRole("link", { name: /inicia sesión|sign in/i }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Middleware protection", () => {
  test("/dashboard redirects to /login without session", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
    // El redirect conserva la URL original
    await expect(page).toHaveURL(/redirect=.%2Fdashboard|redirect=%2Fdashboard/i);
  });

  test("/dashboard/admin redirects to /login too", async ({ page }) => {
    await page.goto("/dashboard/admin");
    await expect(page).toHaveURL(/\/login/);
  });
});
