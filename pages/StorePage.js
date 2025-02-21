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
    );
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
}

module.exports = StorePage;
