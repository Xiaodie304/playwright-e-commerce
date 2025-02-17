// StorePage.js
const { expect } = require("@playwright/test");
class StorePage {
  constructor(page) {
    this.page = page;
    this.menuButton = page.getByRole("button", { name: "Menu" });
    this.storeLink = page.getByRole("link", { name: "Store", exact: true });
    this.allProductsHeading = page.getByRole("heading", {
      name: "All products",
    });
    this.productPrice = page.locator(
      "p.font-normal.font-sans.txt-medium.text-ui-fg-interactive"
    ); // locator giá sản phẩm
  }
  // Phương thức mở Store Page và xác minh phần tử "All products"
  async openStorePageAndVerify() {
    // Khôi phục trạng thái session
    await this.page.context().storageState({ path: "state.json" });
    await this.page.goto("/us");
    await this.menuButton.click(); // Mở menu
    await this.storeLink.click(); // Vào Store
    await expect(this.allProductsHeading).toBeVisible(); // Kiểm tra tiêu đề
  }
}

module.exports = StorePage;
