const { test, expect } = require("@playwright/test");
test.describe("Login Tests", () => {
  test("Login with a valid username and password", async ({ page }) => {
    const username = process.env.TEST_USERNAME;
    const password = process.env.TEST_PASSWORD;
    // testcase đăng nhập với username và password hợp lệ
    await page.goto("https://demo.medusajs.com/us");
    await page.getByRole("link", { name: "Account" }).click();
    await page
      .getByRole("textbox", { name: "Enter a valid email address." })
      .fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();
    await expect(page).toHaveURL(/.*\/us\/account/); // kiểm tra URL có chứa /us/account, header có chứa "Profile"
  });
  test("Login with an invalid username and password", async ({ page }) => {
    // testcase đăng nhập với username và password không hợp lệ
    await page.goto("/us");
    await page.getByRole("link", { name: "Account" }).click();
    await page
      .getByRole("textbox", { name: "Enter a valid email address." })
      .fill("example@abc.com");
    await page.locator('input[name="password"]').fill("123456");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText(/Error: Wrong email or/i)).toBeVisible(); // kiểm tra hiển thị thông báo lỗi "Error: Wrong email or password"
  });
  test("Login without entering username and password", async ({ page }) => {
    // testcase đăng nhập mà không nhập username và password
    const emailInput = page.locator('input[name="email"]');
    await page.goto("/us");
    await page.getByRole("link", { name: "Account" }).click();
    await page.getByRole("button", { name: "Sign in" }).click();
    const errorMessage = await emailInput.evaluate(
      (el) => el.validationMessage // lấy thông báo lỗi khi không nhập username và password từ trường email
    );
    console.log("ErrorMessage:", errorMessage);
    await expect(errorMessage).toMatch(/fill out this field/i);
  });
});
