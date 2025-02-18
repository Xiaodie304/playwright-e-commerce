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

<pre>
git clone https://github.com/Xiaodie304/playwright-e-commerce.git
cd playwright-e-commerce 
npm install
npx playwright install</pre>

🔥 Running Tests

Run all tests:<pre>npm run test</pre>

Run a specific test:<pre>npm run test tests/login.test.js</pre>

📊 Generate Report

<pre>npx playwright show-report</pre>

⚙️ Configuration

- Modify test settings in playwright.config.js  
  Example: To reduce the number of workers if your machine is not very powerful, you can modify the workers setting in playwright.config.js like this:<pre>// playwright.config.js
  module.exports = {
  // Other configurations...
  // Set the number of workers to 1 for machines with low resources
  workers: 1,  
  // Other configurations...
  };</pre>

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

📂 Project Structure

<pre>
├── .github/workflows/  # CI/CD workflow files
│   ├── ci.yml          # GitHub Actions configuration
│
├── locators/           # Page element locators
│   ├── locator.js
│
├── node_modules/       # Dependencies (auto-generated)
│
├── pages/              # Page Object Model (POM) classes
│   ├── CartPage.js
│   ├── LoginPage.js
│   ├── PaymentPage.js
│   ├── StorePage.js
│
├── playwright-report/  # Playwright test reports
│   ├── data/
│   ├── index.html
│
├── sendmail/           # Email notification script
│   ├── sendMail.js
│
├── test-results/       # Test execution results
│   ├── .last-run.json
│   ├── (test result files)
│
├── tests/              # Automated test scripts
│   ├── cart.test.js
│   ├── login.test.js
│   ├── mobileLogin.spec.js
│   ├── payment.test.js
│   ├── search.test.js
│   ├── store.test.js
│
├── utils/              # Utility/helper functions
│   ├── DataHelper.js
│
├── .env                # Environment variables (ignored in .gitignore)
├── .gitignore          # Git ignore file
├── package-lock.json   # Auto-generated dependency lock file
├── package.json        # Project dependencies & scripts
├── playwright.config.js # Playwright test configuration
├── playwright-report.zip # Zipped test reports
├── README.md           # Project documentation
├── state.json          # State management file
</pre>
