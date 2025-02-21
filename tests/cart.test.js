const { test, expect } = require("@playwright/test");
const LoginPage = require("../pages/LoginPage");
const StorePage = require("../pages/StorePage");
const CartPage = require("../pages/CartPage");

let context;
let page;

test.beforeAll(async ({ browser }) => {
  context = await browser.newContext(); // Tạo mới context
  page = await context.newPage(); // Tạo mới trang
  const loginPage = new LoginPage(page); // Khởi tạo trang login

  await loginPage.login(process.env.TEST_USERNAME, process.env.TEST_PASSWORD);
  await page.waitForLoadState("networkidle");

  await context.storageState({ path: "state.json" }); // Lưu trạng thái của trang
  await context.close();
});

test.describe("Shopping Cart", () => {
  let storePage;
  let cartPage;

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext({ storageState: "state.json" }); // Khôi phục trạng thái trước đó
    page = await context.newPage(); // Mở trang mới
    storePage = new StorePage(page); // Khởi tạo trang store
    cartPage = new CartPage(page); // Khởi tạo trang cart
    await storePage.openStorePageAndVerify(); // Mở trang store và kiểm tra
  });

  test.afterEach(async () => {
    await page.close();
    await context.close();
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
