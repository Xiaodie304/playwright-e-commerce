# Dùng Playwright image có sẵn
FROM mcr.microsoft.com/playwright:v1.50.1-jammy

# Đặt thư mục làm việc trong container
WORKDIR /app

# Copy package.json + package-lock.json trước để tối ưu cache
COPY package.json package-lock.json ./

# Cài dependencies trước (giữ lại cache để tránh cài lại khi code thay đổi)
RUN npm ci --frozen-lockfile

# Copy toàn bộ code vào container
COPY . .

# Cài Playwright dependencies
RUN npx playwright install --with-deps

# Cài thêm zip để nén report
RUN apt-get update && apt-get install -y --no-install-recommends zip && rm -rf /var/lib/apt/lists/*

# Chạy test khi container khởi động, sau đó zip report và gửi mail
CMD ["sh", "-c", "npm test; zip -r playwright-report.zip playwright-report/; node sendmail/sendMail.js"]
