const { test, expect } = require("@playwright/test");
const LoginPage = require("../pages/LoginPage"); // import LoginPage
const StorePage = require("../pages/storePage"); // import StorePage
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
  test("Verify product page elements and product details", async ({ page }) => {
    // testcase kiểm tra các phần tử trên trang sản phẩm và chi tiết sản phẩm
    const storePage = new StorePage(page);
    await storePage.openStorePageAndVerify(); // Mở Store và xác minh phần tử
    await page
      .getByRole("link", { name: "Thumbnail BlendMaster Elite" })
      .click();
    await expect(
      page.getByRole("heading", { name: "BlendMaster Elite Fusionator" })
    ).toBeVisible(); // Kiểm tra tiêu đề sản phẩm
    await page
      .getByRole("heading", { name: "Product Information" })
      .getByRole("button")
      .click();
    await expect(
      page.getByText("Material-Country of origin-Type-Weight-Dimensions-")
    ).toBeVisible(); // Kiểm tra thông tin sản phẩm
    await expect(page.getByText("From $")).toBeVisible(); // Kiểm tra giá sản phẩm
  });
  test("Verify products are sorted by price: Low -> High and High -> Low", async ({
    page,
  }) => {
    // testcase kiểm tra sản phẩm được sắp xếp theo giá tăng dần và giảm dần
    const storePage = new StorePage(page);
    await storePage.openStorePageAndVerify();
    // Low -> High
    await page.getByText("Price: Low -> High").click();
    await page.waitForTimeout(1000);
    // Lấy giá sản phẩm và kiểm tra thứ tự tăng dần
    const pricesLowToHigh = await storePage.productPrice.allTextContents();
    const numericPricesLowToHigh = pricesLowToHigh.map((price) =>
      parseFloat(price.replace("$", "").replace(",", "").trim())
    ); // Chuyển đổi giá thành số
    for (let i = 0; i < numericPricesLowToHigh.length - 1; i++) {
      expect(numericPricesLowToHigh[i]).toBeLessThanOrEqual(
        numericPricesLowToHigh[i + 1]
      ); // Kiểm tra thứ tự tăng dần
    }
    // High -> Low
    await page.getByText("Price: High -> Low").click();
    await page.waitForTimeout(1000);
    const pricesHighToLow = await storePage.productPrice.allTextContents();
    const numericPricesHighToLow = pricesHighToLow.map((price) =>
      parseFloat(price.replace("$", "").replace(",", "").trim())
    );
    for (let i = 0; i < numericPricesHighToLow.length - 1; i++) {
      expect(numericPricesHighToLow[i]).toBeGreaterThanOrEqual(
        numericPricesHighToLow[i + 1]
      );
    }
  });
  test("Verify product details, shipping options, and add to cart functionality", async ({
    page, // testcase kiểm tra chi tiết sản phẩm, tùy chọn shipping và thêm vào giỏ hàng
  }) => {
    const storePage = new StorePage(page);
    await storePage.openStorePageAndVerify();
    await page
      .getByRole("link", { name: "Thumbnail Exorbita Elegance Elite $" })
      .click(); // Chọn sản phẩm

    // Kiểm tra thông tin shipping
    await page
      .getByRole("heading", { name: "Shipping & Returns" })
      .getByRole("button")
      .click();
    await expect(page.locator(".w-full > .text-small-regular")).toBeVisible();

    // thêm sản phẩm vào giỏ hàng
    await page.getByRole("button", { name: "Leather" }).click();
    await page.waitForTimeout(1000);
    await page.getByRole("button", { name: "Battery" }).click();
    await page.waitForTimeout(1000);
    await expect(
      page.getByRole("button", { name: /add to cart/i })
    ).toBeVisible();
    await page.getByRole("button", { name: "Add to cart" }).click();

    // Kiểm tra sản phẩm đã được thêm vào giỏ hàng hay chưa
    await expect(page.getByText("Subtotal (excl. taxes)")).toBeVisible();
  });
});
