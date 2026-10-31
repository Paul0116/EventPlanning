import { clerk } from "@clerk/testing/playwright";
import { expect, test } from "@playwright/test";

const hasLiveIdentity = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.CLERK_SECRET_KEY &&
    process.env.E2E_CLERK_USER_EMAIL &&
    process.env.DATABASE_URL,
);

test.skip(!hasLiveIdentity, "Requires Clerk development keys, a synthetic Clerk user, and PostgreSQL.");

test("a user signs in, creates an event, and revisits it", async ({ page }) => {
  const title = `Foundation event ${Date.now()}`;

  await page.goto("/");
  await clerk.signIn({ page, emailAddress: process.env.E2E_CLERK_USER_EMAIL! });
  await page.goto("/events");

  await page.getByRole("link", { name: "Create event" }).click();
  await page.getByLabel("Event title").fill(title);
  await page.getByLabel("Event type").selectOption("CORPORATE");
  await page.getByLabel("Starts").fill("2027-02-20T18:00");
  await page.getByLabel("Ends").fill("2027-02-20T22:00");
  await page.getByLabel("Event time zone").fill("Asia/Manila");
  await page.getByLabel("Currency").selectOption("PHP");
  await page.getByRole("button", { name: "Create draft event" }).click();

  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(page.getByText("6 categories")).toBeVisible();
  await page.getByRole("link", { name: /all events/i }).first().click();
  await expect(page.getByRole("heading", { name: title })).toBeVisible();
});
