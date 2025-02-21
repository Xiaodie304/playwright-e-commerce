const { test, expect } = require("@playwright/test");
const LoginPage = require("../pages/LoginPage");
const PaymentPage = require("../pages/PaymentPage");

let context;
let page;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
  await page.waitForLoadState("networkidle");

  await context.storageState({ path: "state.json" });
  await context.close();
});

test.describe("Payment Page", () => {
  let paymentProcess;

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext({ storageState: "state.json" });
    page = await context.newPage();
    paymentProcess = new PaymentPage(page);
    await paymentProcess.openStorePageAndVerify();
    await paymentProcess.addProductToCart();
  });

  test.afterEach(async () => {
    await context.close();
  });
  test("Complete order flow", async () => {
    // testcase hoàn thành quy trình đặt hàng
    await paymentProcess.goToCheckoutAndVerify(); // Đi đến trang thanh toán
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
  test("Order with empty email field", async () => {
    // testcase đặt hàng với trường email trống
    const paymentProcess = new PaymentPage(page);
    await paymentProcess.openStorePageAndVerify();
    await paymentProcess.addProductToCart();
    await paymentProcess.goToCheckoutAndVerify();
    await paymentProcess.fillShippingInfo();
    await paymentProcess.email.fill(""); // Clear trường email
    await page.getByRole("button", { name: "Continue to delivery" }).click();
    const errorMessage = await paymentProcess.email.evaluate(
      (el) => el.validationMessage
    );
    console.log("ErrorMessage:", errorMessage);
    await expect(errorMessage).toMatch(/fill out this field/i); // Kiểm tra thông báo lỗi
  });
  test("Order with empty first name field", async () => {
    const paymentProcess = new PaymentPage(page);
    await paymentProcess.openStorePageAndVerify();
    await paymentProcess.addProductToCart();
    await paymentProcess.goToCheckoutAndVerify();
    await paymentProcess.fillShippingInfo();
    await paymentProcess.firstName.fill(""); // Clear trường first name
    await page.getByRole("button", { name: "Continue to delivery" }).click();
    const errorMessage = await paymentProcess.firstName.evaluate(
      (el) => el.validationMessage
    );
    console.log("ErrorMessage:", errorMessage);
    await expect(errorMessage).toMatch(/fill out this field/i);
  });
});
