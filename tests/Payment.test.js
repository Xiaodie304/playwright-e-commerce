const { test, expect } = require("@playwright/test");
const LoginPage = require("../pages/LoginPage");
const PaymentPage = require("../pages/PaymentPage");
let context;
let page;
test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;
  const loginPage = new LoginPage(page); // Tạo instance của LoginPage
  await loginPage.login(username, password);
  await context.storageState({ path: "state.json" });
});
test.afterAll(async () => {
  await context.close();
});
test.describe("Product Page Tests", () => {
  test("Complete order flow", async ({ page }) => {
    const paymentProcess = new PaymentPage(page);
    await paymentProcess.openStorePageAndVerify(); // Xem tất cả sản phẩm
    await paymentProcess.addProductToCart(); // Thêm sản phẩm vào giỏ hàng
    await page.getByRole("button", { name: "Go to checkout" }).click();
    await page.getByRole("heading", { name: "In your Cart" }).isVisible();
    await paymentProcess.fillShippingInfo(); // Điền thông tin giao hàng
    await page.getByRole("button", { name: "Continue to delivery" }).click();
    await page.getByRole("radio", { name: "FakeEx Express $" }).click();
    await page.getByRole("button", { name: "Continue to payment" }).click();
    await page.getByRole("radio", { name: "Test payment" }).click();
    await page.getByRole("button", { name: "Continue to review" }).click();
    await page.getByRole("button", { name: "Place order" }).click();
    await page.getByText("Your order was placed").isVisible(); // Xác nhận đặt hàng
    await page.getByText("Order number:").isVisible(); // Xác nhận mã đơn hàng
  });
  test("Order with empty email field", async ({ page }) => {
    const paymentProcess = new PaymentPage(page);
    await paymentProcess.openStorePageAndVerify();
    await paymentProcess.addProductToCart();
    await page.getByRole("button", { name: "Go to checkout" }).click();
    await page.getByRole("heading", { name: "In your Cart" }).isVisible();
    await paymentProcess.fillShippingInfo();
    await paymentProcess.email.fill(""); // Clear trường email
    await page.getByRole("button", { name: "Continue to delivery" }).click();
    const errorMessage = await paymentProcess.email.evaluate(
      (el) => el.validationMessage
    );
    console.log("ErrorMessage:", errorMessage);
    await expect(errorMessage).toMatch(/fill out this field/i); // Kiểm tra thông báo lỗi
  });
  test("Order with empty first name field", async ({ page }) => {
    const paymentProcess = new PaymentPage(page);
    await paymentProcess.openStorePageAndVerify();
    await paymentProcess.addProductToCart();
    await page.getByRole("button", { name: "Go to checkout" }).click();
    await page.getByRole("heading", { name: "In your Cart" }).isVisible();
    await paymentProcess.fillShippingInfo();
    await paymentProcess.firstName.fill(""); // Clear trường first name
    await page.getByRole("button", { name: "Continue to delivery" }).click();
    const errorMessage = await paymentProcess.firstName.evaluate(
      (el) => el.validationMessage
    );
    console.log("ErrorMessage:", errorMessage);
    await expect(errorMessage).toMatch(/fill out this field/i); // Kiểm tra thông báo lỗi
  });
});
