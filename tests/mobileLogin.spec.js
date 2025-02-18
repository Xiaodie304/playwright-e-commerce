const { test, expect } = require("@playwright/test");
test.describe("Login Tests", () => {
  const viewport = { width: 390, height: 844 }; // iPhone 13 viewport
  const userAgent =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/537.36 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/537.36"; // iPhone 13 user agent
  test("Login with a valid username and password", async ({ browser }) => {
    const context = await browser.newContext({
      viewport,
      userAgent,
    });
    const page = await context.newPage();
    const username = process.env.TEST_USERNAME;
    const password = process.env.TEST_PASSWORD;
    // testcase đăng nhập với username và password hợp lệ
    await page.goto("https://demo.medusajs.com/us");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("link", { name: "Account" }).click();
    await page
      .getByRole("textbox", { name: "Enter a valid email address." })
      .fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.getByRole("link", { name: "Profile" }).click();
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();
    await expect(page).toHaveURL(/.*\/us\/account/);
    await context.close();
  });
  test("Login with an invalid username and password", async ({ browser }) => {
    const context = await browser.newContext({
      viewport,
      userAgent,
    });
    const page = await context.newPage();
    // testcase đăng nhập với username và password không hợp lệ
    await page.goto("/us");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("link", { name: "Account" }).click();
    await page
      .getByRole("textbox", { name: "Enter a valid email address." })
      .fill("example@abc.com");
    await page.locator('input[name="password"]').fill("123456");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText(/Error: Wrong email or/i)).toBeVisible();
    await context.close();
  });

  test("Login without entering username and password", async ({ browser }) => {
    const context = await browser.newContext({
      viewport,
      userAgent,
    });
    const page = await context.newPage();
    // testcase đăng nhập mà không nhập username và password
    await page.goto("/us");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("link", { name: "Account" }).click();
    await page.getByRole("button", { name: "Sign in" }).click();
    const errorMessage = await page
      .locator('input[name="email"]')
      .evaluate((el) => el.validationMessage);
    console.log("ErrorMessage:", errorMessage);
    await expect(errorMessage).toMatch(/fill out this field/i);

    await context.close();
  });
});
