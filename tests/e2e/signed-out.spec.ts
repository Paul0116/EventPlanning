import { expect, test } from "@playwright/test";

test("signed-out visitors cannot access the workspace or protected API", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /one private workspace/i })).toBeVisible();

  await page.goto("/events");
  await expect(page).toHaveURL(/\/sign-in/);
  await expect(page.getByRole("heading", { name: /authentication setup required/i })).toBeVisible();

  const response = await request.get("/api/v1/events");
  expect(response.status()).toBe(401);
  expect(response.headers()["x-request-id"]).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({
    error: {
      code: "AUTHENTICATION_REQUIRED",
      message: "Sign in is required.",
    },
  });
});
