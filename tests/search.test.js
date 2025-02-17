const { test, expect } = require("@playwright/test");
test.describe("Medusa Store Search Tests", () => {
  test("Medusa store search test", async ({ page }) => {
    await page.goto("/us");
    await expect(
      page.getByRole("heading", { name: "Ecommerce Starter Template" })
    ).toBeVisible();
    await page.getByRole("link", { name: "Search" }).click();
    const productNames = [
      "BlendMaster Elite Fusionator",
      "Exorbita Elegance Elite",
      "Pinnacle Posh Pack",
    ];
    const randomName =
      productNames[Math.floor(Math.random() * productNames.length)]; // Chọn ngẫu nhiên tên sản phẩm
    await page
      .getByRole("searchbox", { name: "Search products..." })
      .fill(randomName);
    const firstSearchResult = page.getByRole("link", { name: randomName });
    await expect(firstSearchResult).toBeVisible(); // Kiểm tra sản phẩm đầu tiên trong kết quả tìm kiếm
  });

  test("Medusa store search no results", async ({ page }) => {
    const { faker } = require("@faker-js/faker");
    await page.goto("/us");
    await expect(
      page.getByRole("heading", { name: "Ecommerce Starter Template" })
    ).toBeVisible();
    await page.getByRole("link", { name: "Search" }).click();
    const fakeSearchTerm = faker.lorem.words(3);
    await page
      .getByRole("searchbox", { name: "Search products..." })
      .fill(fakeSearchTerm);
    // Kiểm tra xem có thông báo "No results found" hay không
    await expect(page.getByText("No results found")).toBeVisible();
  });
});
