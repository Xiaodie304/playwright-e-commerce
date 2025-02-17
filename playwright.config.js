//playwright.config.js
require("dotenv").config(); // Load biến môi trường từ .env
const { defineConfig } = require("@playwright/test");
module.exports = defineConfig({
  use: {
    headless: true,
    viewport: { width: 1366, height: 768 },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    baseURL: process.env.BASE_URL,
  },
  workers: 2, // Số worker chạy song song
  reporter: [["html", { open: "never" }]],
});
