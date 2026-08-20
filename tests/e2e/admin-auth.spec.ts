import { expect, test } from "@playwright/test";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@heartmatters.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "Admin123!ChangeMe";

test.describe("Admin authentication", () => {
  test("redirects unauthenticated users from protected admin routes", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole("heading", { name: "Admin sign in" })).toBeVisible();
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/admin/login");

    await page.getByLabel("Email").fill("wrong@example.com");
    await page.getByLabel("Password").fill("WrongPassword123!");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByText("Invalid email or password")).toBeVisible();
  });

  test("signs in with valid credentials and reaches the dashboard", async ({
    page,
  }) => {
    await page.goto("/admin/login");

    await page.getByLabel("Email").fill(ADMIN_EMAIL);
    await page.getByLabel("Password").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page).toHaveURL(/\/admin(?:\/)?$/);
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible({
      timeout: 15_000,
    });
  });
});
