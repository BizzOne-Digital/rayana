import { expect, test } from "@playwright/test";

test.describe("Public pages", () => {
  test("home page loads with brand content", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Heart Matters/i);
    await expect(
      page.getByRole("heading", {
        name: /A Deeper Way of Seeing into What Matters/i,
      }),
    ).toBeVisible();
  });

  test("contact page displays phone number from site settings", async ({ page }) => {
    await page.goto("/contact");

    await expect(page.getByRole("heading", { name: "Contact" })).toBeVisible();
    // Seeded displayPhone format from SiteSettings (scripts/seed.ts)
    await expect(page.getByText(/1\.604\.771\.7804/)).toBeVisible();
    await expect(page.getByText(/rayanadesilva@heartmatters\.com/i)).toBeVisible();
  });
});
