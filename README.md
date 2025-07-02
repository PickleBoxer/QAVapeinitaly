# VapeIniItaly E2E Tests

End-to-end testing suite for the VapeIniItaly website using [Playwright](https://playwright.dev/).

## 📋 Overview

This project contains automated end-to-end tests for the VapeIniItaly e-commerce website. It tests critical user flows including:

- Age verification popup functionality
- Cookie consent handling
- MailChimp popup interactions
- User authentication
- Payment options validation

The tests run on Chromium by default, with configurations available for Firefox and WebKit.

## 🔧 Setup

### Prerequisites

- Node.js 16 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vapeinitaly-tests.git
cd vapeinitaly-tests
```

2. Install dependencies:
```bash
npm ci
```

3. Install Playwright browsers:
```bash
npx playwright install --with-deps
```

4. Set up environment variables:
```bash
npm run setup-env
```
This will create a `.env` file from the `.env.example` template if one doesn't exist. 
Update the `.env` file with your test credentials.

## 🚀 Running Tests

### Run all tests:

```bash
npm test
```

### Run a specific test:

```bash
npx playwright test campaigns/01_frontOffice/01_test.spec.js
```

### Run tests with UI mode:

```bash
npx playwright test --ui
```

### Run tests in headed mode (to see the browser):

```bash
npx playwright test --headed
```

### Run a specific test by title pattern:

```bash
npx playwright test -g "Payment Option"
```

## 📊 Test Reports

After running tests, you can view the HTML report:

```bash
npx playwright show-report
```

The report will be available at `playwright-report/index.html`.

## 📁 Project Structure

- **campaigns/** - Contains organized test suites
  - **01_frontOffice/** - Front office tests (user-facing website tests)
- **playwright.config.js** - Main configuration file
- **.github/workflows/** - CI/CD workflow configuration
- **.env** - Local environment variables (not committed to git)
- **.env.example** - Template for environment variables

## 🔒 Environment Variables

The following environment variables are required:

- `TEST_USER_EMAIL` - Email for user authentication tests
- `TEST_USER_PASSWORD` - Password for user authentication tests

> **ℹ️ Note:**  
> The following variables are **only required for GitHub workflows** and are **not necessary for local development**:
>
> - `QA_UPLOAD_TOKEN` – Token for uploading test results to the reporting API  
> - `API_BASE_URL` – Base URL for the API used in tests


For local development, these can be set in the `.env` file.
For CI/CD, these are set as GitHub secrets.

## 🤖 CI/CD Integration

Tests are automatically run on GitHub Actions:

- On manual triggers (workflow_dispatch)
- On a nightly schedule (midnight)

The workflow uploads test results to a reporting API for monitoring.

## 🛠️ Troubleshooting

If you encounter issues with environment variables:

1. Make sure the `.env` file exists and contains the required variables
2. Run `npm run setup-env` to verify the setup

For test failures, check the screenshots and traces in the `test-results/` directory.
