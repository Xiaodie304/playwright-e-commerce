//PaymentPage.js
const { expect } = require("@playwright/test");
const { faker } = require("@faker-js/faker"); // Sử dụng fakerjs để tạo dữ liệu giả
class PaymentPage {
  constructor(page) {
    this.page = page;
    this.menuButton = page.getByRole("button", { name: "Menu" });
    this.storeLink = page.getByRole("link", { name: "Store", exact: true });
    this.allProductsHeading = page.getByRole("heading", {
      name: "All products",
    });
    this.productThumbnail = page.getByRole("link", {
      name: "Pinnacle Posh Pack",
    });
    this.euButton = page.getByRole("button", { name: "Black" });
    this.addToCartButton = page.getByRole("button", { name: "Add to cart" });
    this.goToCartButton = page.getByRole("button", { name: "Go to cart" });
    this.summaryHeading = page.getByRole("heading", { name: "Summary" });

    // Các trường thông tin giao hàng
    this.firstName = page.locator(
      'input[name="shipping_address\\.first_name"]'
    );
    this.lastName = page.locator('input[name="shipping_address\\.last_name"]');
    this.address = page.locator('input[name="shipping_address\\.address_1"]');
    this.company = page.locator('input[name="shipping_address\\.company"]');
    this.postalCode = page.locator(
      'input[name="shipping_address\\.postal_code"]'
    );
    this.city = page.locator('input[name="shipping_address\\.city"]');
    this.phone = page.locator('input[name="shipping_address\\.phone"]');
    this.email = page.locator('input[name="email"]');
    this.province = page.locator('input[name="shipping_address.province"]');
  }

  // Mở Store Page và xác minh phần tử "All products"
  async openStorePageAndVerify() {
    await this.page.goto("/us");
    await this.menuButton.click();
    await this.storeLink.click();
    await expect(this.allProductsHeading).toBeVisible();
    await this.productThumbnail.click();
  }

  // Thêm sản phẩm vào giỏ hàng
  async addProductToCart() {
    await this.page.waitForTimeout(1000);
    await this.euButton.click();
    await this.addToCartButton.click();
    await this.goToCartButton.click();
    await expect(this.summaryHeading).toBeVisible();
  }

  // Điền thông tin giao hàng
  async fillShippingInfo() {
    await this.firstName.fill(faker.person.firstName());
    await this.lastName.fill(faker.person.lastName());
    await this.address.fill(faker.location.streetAddress());
    await this.phone.fill(faker.phone.number());
    await this.postalCode.fill(faker.location.zipCode());
    await this.city.fill(faker.location.city());
    await this.email.fill(faker.internet.email());
    await this.province.fill(faker.location.state());
    await this.page.getByRole("combobox").selectOption("United States");
  }

  async goToCheckoutAndVerify() {
    await this.page.getByRole("button", { name: "Go to checkout" }).click();
    await this.page.getByRole("heading", { name: "In your Cart" }).isVisible();
  }
}

module.exports = PaymentPage;
