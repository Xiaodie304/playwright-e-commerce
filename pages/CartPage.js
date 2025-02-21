const { expect } = require("@playwright/test");

class StorePage {
  // Tạo class StorePage
  constructor(page) {
    this.page = page;
    this.menuButton = page.getByRole("button", { name: "Menu" });
    this.storeLink = page.getByRole("link", { name: "Store", exact: true });
    this.allProductsHeading = page.getByRole("heading", {
      name: "All products",
    });
    this.productPrice = page.locator(
      "p.font-normal.font-sans.txt-medium.text-ui-fg-interactive"
    );
    this.euButton = page.getByRole("button", { name: "EU" });
    this.addToCartButton = page.getByRole("button", { name: "Add to cart" });
    this.goToCartButton = page.getByRole("button", { name: "Go to cart" });
  }
  // Mở trang cửa hàng và kiểm tra
  async openStorePageAndVerify() {
    await this.page.goto("/us");
    if (await this.menuButton.isVisible()) {
      await this.menuButton.click();
    }
    await this.storeLink.click();
    await expect(this.allProductsHeading).toBeVisible();
  }
  // Thêm sản phẩm vào giỏ hàng
  async addItemToCart() {
    await this.euButton.click();
    await this.addToCartButton.click();
    await this.goToCartButton.click();
  }
}

module.exports = StorePage;
