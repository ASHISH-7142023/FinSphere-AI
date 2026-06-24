import { expect, test } from "@playwright/test";

test("renders auth screen", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("FinSphere AI").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Login" })).toBeVisible();
});
