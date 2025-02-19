require("dotenv").config(); // Load biến môi trường từ .env
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  use: {
    headless: true, // Chạy ở chế độ headless( không có giao diện) -> false để hiển thị giao diện
    viewport: { width: 1366, height: 768 },
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    baseURL: process.env.BASE_URL,
  },
  projects: [
    {
      name: "chromium", // Chạy trên Chromium
      use: { browserName: "chromium" },
    },
  ],
  workers: 3, // Số worker chạy song song
  reporter: [["html", { open: "never" }]],
});
