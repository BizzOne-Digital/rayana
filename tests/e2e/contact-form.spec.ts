import { expect, test } from "@playwright/test";

test.describe("Contact form validation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
    await expect(page.getByText("Send a Message")).toBeVisible();
  });

  test("requires name, email, and message before submission", async ({ page }) => {
    await page.getByRole("button", { name: "Send Message" }).click();

    const nameInput = page.getByPlaceholder("Your name");
    const emailInput = page.getByPlaceholder("Email address");
    const messageInput = page.getByPlaceholder("Your message");

    expect(await nameInput.evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(
      false,
    );
    expect(await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(
      false,
    );
    expect(
      await messageInput.evaluate((el: HTMLTextAreaElement) => el.validity.valid),
    ).toBe(false);
  });

  test("rejects invalid email format", async ({ page }) => {
    await page.getByPlaceholder("Your name").fill("Test User");
    await page.getByPlaceholder("Email address").fill("not-an-email");
    await page.getByPlaceholder("Your message").fill("This is a long enough message.");
    await page.getByRole("button", { name: "Send Message" }).click();

    const emailInput = page.getByPlaceholder("Email address");
    expect(await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(
      false,
    );
  });

  test("rejects messages shorter than the API minimum via server validation", async ({
    page,
  }) => {
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/contact") && response.request().method() === "POST",
    );

    await page.getByPlaceholder("Your name").fill("Test User");
    await page.getByPlaceholder("Email address").fill("test@example.com");
    await page.getByPlaceholder("Your message").fill("Too short");
    await page.getByRole("button", { name: "Send Message" }).click();

    const response = await responsePromise;
    expect(response.status()).toBeGreaterThanOrEqual(400);
  });

  test("accepts a valid submission", async ({ page }) => {
    const responsePromise = page.waitForResponse(
      (response) =>
        response.url().includes("/api/contact") && response.request().method() === "POST",
    );

    await page.getByPlaceholder("Your name").fill("Playwright Test");
    await page.getByPlaceholder("Email address").fill("playwright@example.com");
    await page
      .getByPlaceholder("Your message")
      .fill("This is a valid contact message for automated testing.");
    await page.getByRole("button", { name: "Send Message" }).click();

    const response = await responsePromise;
    expect(response.ok()).toBe(true);
    await expect(page.getByText(/message has been sent|Thank you/i)).toBeVisible();
  });
});
