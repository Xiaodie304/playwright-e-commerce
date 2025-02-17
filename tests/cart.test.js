const { test, expect } = require("@playwright/test");
const LoginPage = require("../pages/LoginPage"); // import LoginPage
const StorePage = require("../pages/CartPage"); // import CartPage
let context;
let page;
test.beforeAll(async ({ browser }) => {
  context = await browser.newContext();
  page = await context.newPage();
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;
  const loginPage = new LoginPage(page); // tạo instance của LoginPage
  await loginPage.login(username, password); // thực hiện login
  // Lưu trạng thái session
  await context.storageState({ path: "state.json" });
});
test.afterAll(async () => {
  await context.close();
});
test.describe("Product Page Tests", () => {
  test("Add product to cart successfully", async ({ page }) => {
    // test case thêm sản phẩm vào giỏ hàng thành công
    const storePage = new StorePage(page); // Tạo instance của StorePage
    await storePage.openStorePageAndVerify(); // Mở Store và chọn sản phẩm cần mua
    await page.getByRole("button", { name: "EU" }).click();
    await page.getByRole("button", { name: "Add to cart" }).click();
    await page.getByRole("button", { name: "Go to cart" }).click();
    await page.getByRole("heading", { name: "Summary" }).isVisible();
  });
  test("Remove product from cart successfully", async ({ page }) => {
    // test case xóa sản phẩm khỏi giỏ hàng thành công
    const storePage = new StorePage(page);
    await storePage.openStorePageAndVerify();
    await page.getByRole("button", { name: "EU" }).click();
    await page.getByRole("button", { name: "Add to cart" }).click();
    await page.getByRole("button", { name: "Go to cart" }).click();
    await page.getByRole("heading", { name: "Summary" }).isVisible();
    const randomOption = Math.floor(Math.random() * 9) + 1;
    await page.getByRole("combobox").selectOption(randomOption.toString()); // Chọn một option số lượng ngẫu nhiên
    await page
      .getByRole("row", { name: "Thumbnail BlendMaster Elite" })
      .getByRole("button")
      .click(); // Xóa sản phẩm khỏi giỏ hàng
    await page.getByText("You don't have anything in").isVisible();
  });
});
