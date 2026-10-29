import { test, expect } from "@playwright/test";

async function reset(page) {
  await page.addInitScript(() => localStorage.clear());
}

test.beforeEach(async ({ page }) => {
  await reset(page);
});

test("sidebar navigates, collapses, and persists the preference", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("FindIt").first()).toBeVisible();
  await page.getByRole("link", { name: "Browse items" }).click();
  await expect(page).toHaveURL(/\/browse$/);
  await page.getByRole("button", { name: "Collapse sidebar" }).click();
  await page.reload();
  await expect(page.getByRole("button", { name: "Expand sidebar" })).toBeVisible();
});

test("mobile navigation opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(page.getByRole("link", { name: "Browse items" })).toBeVisible();
  await page.getByRole("link", { name: "Browse items" }).click();
  await expect(page).toHaveURL(/\/browse$/);
});

test("theme persists across reloads", async ({ page }) => {
  await page.goto("/settings");
  await page.getByRole("button", { name: "Dark" }).click();
  await page.reload();
  await expect(page.locator("body")).toHaveCSS("background-color", "rgb(32, 33, 36)");
});

test("report creation appears in browse and can be edited", async ({ page }) => {
  await page.goto("/report");
  await page.getByLabel("Item Name").fill("Test blue notebook");
  await page.getByLabel("Category").click();
  await page.getByRole("option", { name: "School supplies" }).click();
  await page.getByLabel("Location").fill("Test Library");
  await page.getByLabel("Description").fill("A unique test notebook for browser coverage.");
  await page.getByRole("button", { name: "Submit Report" }).click();
  await page.goto("/browse");
  await expect(page.getByText("Test blue notebook")).toBeVisible();
  await page.goto("/dashboard");
  await page.getByRole("link", { name: "Edit" }).first().click();
  await expect(page.getByRole("heading", { name: "Edit your report" })).toBeVisible();
});

test("saved and recently viewed items update", async ({ page }) => {
  await page.goto("/browse");
  await page.getByRole("button", { name: /Save item/ }).first().click();
  await page.goto("/saved");
  await expect(page.getByText("Green water bottle")).toBeVisible();
  await page.goto("/browse");
  await page.getByRole("link", { name: /Green water bottle/ }).click();
  await page.goto("/recent");
  await expect(page.getByText("Green water bottle")).toBeVisible();
});

test("claim can be submitted and withdrawn", async ({ page }) => {
  await page.goto("/items/demo-1");
  await page.getByRole("button", { name: "Request Claim" }).click();
  await page.getByLabel("Ownership details").fill("A unique private sticker is on the cap.");
  await page.getByRole("button", { name: "Submit Claim" }).click();
  await page.goto("/claims");
  await expect(page.getByText("pending")).toBeVisible();
  await page.getByRole("button", { name: "Withdraw pending claim" }).click();
  await expect(page.getByText("withdrawn")).toBeVisible();
});

test("settings reset and notification controls are available", async ({ page }) => {
  await page.goto("/notifications");
  await page.getByRole("button", { name: "Mark all as read" }).click();
  await page.goto("/settings");
  await page.getByRole("button", { name: "Reset demo data" }).click();
  await page.getByRole("button", { name: "Reset data" }).click();
  await expect(page.getByText("Demo data reset.")).toBeVisible();
});
