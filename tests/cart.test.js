const { test, expect } = require("@playwright/test");
const LoginPage = require("../pages/LoginPage");
const StorePage = require("../pages/StorePage");
const CartPage = require("../pages/CartPage");

let context;
let page;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext(); // Giữ context để tái sử dụng
  page = await context.newPage();
  const loginPage = new LoginPage(page);

  await loginPage.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
  await page.waitForLoadState("networkidle");

  await context.storageState({ path: "state.json" });
});

test.afterAll(async () => {
  await context.close(); // Đóng context sau khi tất cả test chạy xong
});

test.describe("Shopping Cart", () => {
  let storePage;
  let cartPage;

  test.beforeEach(async () => {
    page = await context.newPage(); // Chỉ mở page mới, không tạo lại context
    storePage = new StorePage(page);
    cartPage = new CartPage(page);
    await storePage.openStorePageAndVerify();
  });

  test.afterEach(async () => {
    await page.close();
  });

  test("Add product to cart successfully", async () => {
    // testcase thêm sản phẩm vào giỏ hàng thành công
    await page
      .getByRole("link", { name: "Thumbnail BlendMaster Elite" })
      .click();
    await cartPage.addItemToCart();
    await expect(page.getByRole("heading", { name: "Summary" })).toBeVisible(); // Kiểm tra xem đã thêm sản phẩm vào giỏ hàng thành công chưa
  });

  test("Remove product from cart successfully", async () => {
    // testcase xóa sản phẩm khỏi giỏ hàng thành công
    await page
      .getByRole("link", { name: "Thumbnail BlendMaster Elite" })
      .click();
    await cartPage.addItemToCart();
    await expect(page.getByRole("heading", { name: "Summary" })).toBeVisible();

    const randomOption = Math.floor(Math.random() * 9) + 1;
    await page.getByRole("combobox").selectOption(randomOption.toString());
    await page
      .getByRole("row", { name: "Thumbnail BlendMaster Elite" })
      .getByRole("button")
      .click();
    await expect(page.getByText(/You don't have anything in/i)).toBeVisible(); // Kiểm tra xem đã xóa sản phẩm khỏi giỏ hàng thành công chưa
  });
});
