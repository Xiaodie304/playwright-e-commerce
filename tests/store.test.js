const { test, expect } = require("@playwright/test");
const LoginPage = require("../pages/LoginPage");
const StorePage = require("../pages/StorePage");

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

test.describe("Store Page", () => {
  let storePage;

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext({ storageState: "state.json" });
    page = await context.newPage();
    storePage = new StorePage(page);
    await storePage.openStorePageAndVerify();
  });

  test.afterEach(async () => {
    await context.close();
  });
  test("Verify product page elements and product details", async () => {
    // testcase kiểm tra các phần tử trên trang sản phẩm và chi tiết sản phẩm
    await page
      .getByRole("link", { name: "Thumbnail BlendMaster Elite" })
      .click();
    await expect(
      page.getByRole("heading", { name: "BlendMaster Elite Fusionator" })
    ).toBeVisible();
    await page
      .getByRole("heading", { name: "Product Information" })
      .getByRole("button")
      .click();
    await expect(
      page.getByText("Material-Country of origin-Type-Weight-Dimensions-")
    ).toBeVisible();
    await expect(page.getByText("From $")).toBeVisible();
  });
  test("Verify products are sorted by price: Low -> High and High -> Low", async () => {
    // testcase kiểm tra sản phẩm được sắp xếp theo giá tăng dần và giảm dần
    await page.getByText("Price: Low -> High").click();
    await page.waitForTimeout(1000);
    const pricesLowToHigh = await storePage.productPrice.allTextContents();
    const numericPricesLowToHigh = pricesLowToHigh.map((price) =>
      parseFloat(price.replace("$", "").replace(",", "").trim())
    ); // chuyển đổi giá thành số
    for (let i = 0; i < numericPricesLowToHigh.length - 1; i++) {
      expect(numericPricesLowToHigh[i]).toBeLessThanOrEqual(
        numericPricesLowToHigh[i + 1]
      ); // Kiểm tra giá tăng dần
    }
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
  test("Verify product details, shipping options, and add to cart functionality", async () => {
    // testcase kiểm tra chi tiết sản phẩm, tùy chọn vận chuyển và chức năng thêm vào giỏ hàng
    await page
      .getByRole("link", { name: "Thumbnail Exorbita Elegance Elite $" })
      .click();
    await page
      .getByRole("heading", { name: "Shipping & Returns" })
      .getByRole("button")
      .click();
    await expect(page.locator(".w-full > .text-small-regular")).toBeVisible(); // Kiểm tra vận chuyển
    await page.getByRole("button", { name: "Leather" }).click();
    await page.getByRole("button", { name: "Battery" }).click();
    await expect(
      page.getByRole("button", { name: /add to cart/i })
    ).toBeVisible();
    await page.getByRole("button", { name: "Add to cart" }).click();
    await expect(page.getByText("Subtotal (excl. taxes)")).toBeVisible();
  });
});
