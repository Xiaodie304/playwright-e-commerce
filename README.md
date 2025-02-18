# playwright-e-commerce

📌 Features  
✅ End-to-end tests for critical user flows (login, checkout, cart, etc.)  
✅ Cross-browser testing (Chromium, Firefox, WebKit, Mobile Viewport)  
✅ Headless & UI mode execution  
✅ Parallel test execution  
✅ CI/CD integration

📝 Registration Notice  
If you haven't registered an account for testing yet, please sign up at [MedusaJS Demo Site](https://demo.medusajs.com) to start testing.

🚀 Installation

<pre>mkdir playwright-e-commerce
cd playwright-e-commerce
git clone https://github.com/Xiaodie304/playwright-e-commerce.git  
npm install
npx playwright install</pre>

🔥 Running Tests  
Run all tests:

<pre>npm run test</pre>

Run a specific test:

<pre>npm run test tests/login.test.js</pre>

📊 Generate Report

<pre>npx playwright show-report</pre>

⚙️ Configuration

- Modify test settings in playwright.config.js
- Environment variables can be set in .env

<pre>
# Test account credentials  
TEST_USERNAME=demo_user   # Test login username  
TEST_PASSWORD=demo_pass   # Test login password  

# Target website URL  
BASE_URL=https://demo.medusajs.com   # Website under test  

# Email configuration for notifications  
EMAIL_USER=testemail@gmail.com # Sender email account  
EMAIL_PASS=abcd1234xyz         # Email app password  
MAIL_TO=receiver@example.com   # Recipient email address  
</pre>

🛠 Dependencies

- Node.js 22+
- Playwright (@playwright/test)
- dotenv (if needed for env configs)

📌 CI/CD

- GitHub Actions / Jenkins integration (if applicable)
