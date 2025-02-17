// LoginPage.js
const { expect } = require("@playwright/test");
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.getByRole("textbox", {
      name: "Enter a valid email address.",
    });
    this.passwordInput = page.locator('input[name="password"]');
    this.signInButton = page.getByRole("button", { name: "Sign in" });
  }

  async login(username, password) {
    await this.page.goto("https://demo.medusajs.com/us");
    await this.page.getByRole("link", { name: "Account" }).click();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }
}

module.exports = LoginPage;
