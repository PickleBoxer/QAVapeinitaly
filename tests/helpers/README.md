# Test Helpers Documentation

This directory contains reusable test utilities and helpers to reduce code duplication and improve test consistency across the Playwright test suite.

## Files

### `common.js` - TestHelpers Class
Contains the main `TestHelpers` class with reusable methods for common test operations.

### `base.js` - Test Setup Utilities
Contains setup utilities and imports for easy test configuration.

## Usage

### Basic Setup

```javascript
// @ts-check
import { test, expect, setupTest } from '../../../../../helpers/base.js';
import { TestHelpers } from '../../../../../helpers/common.js';

let helpers;

test.beforeEach(async ({ page }) => {
    helpers = await setupTest(page);
});
```

### Alternative Setup (Manual)

```javascript
// @ts-check
import { test, expect } from '@playwright/test';
import { TestHelpers } from '../../../../../helpers/common.js';

let helpers;

test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await helpers.goToHomepage(); // Optional - sets up cookies and navigates to homepage
});
```

## Available Methods

### Navigation & Setup
- `goToHomepage()` - Navigate to homepage with cookies setup
- `setupCookies()` - Set age verification and MailChimp cookies
- `goToLoginPage()` - Navigate to login page and verify URL

### Authentication
- `login(email, password)` - Complete login flow (default credentials from env)
- `fillLoginForm(email, password)` - Fill login form fields
- `submitLoginForm()` - Submit the login form
- `logoutViaHeader()` - Logout using header link
- `logoutViaAccountPage()` - Logout via account page
- `verifyLoginSuccess()` - Assert successful login
- `verifyLoginFailure()` - Assert login failure with error message
- `verifyLogoutSuccess()` - Assert successful logout

### Page Verification
- `verifyHomePage()` - Assert user is on home page (body#index)
- `verifyAuthenticationPage()` - Assert user is on auth page (body#authentication)
- `verifySearchPage()` - Assert user is on search page (body#search)

### Shopping Cart
- `addItemToCart()` - Add item to cart using quick-view
- `verifyCartHasItems()` - Assert cart contains items

### Popup Handling
- `handleCookieConsent()` - Accept cookie consent if visible
- `handleAgeVerification()` - Accept age verification if visible
- `handleMailChimpPopup()` - Close MailChimp popup if visible

### Utility Methods
- `setMobileViewport()` - Set mobile viewport size
- `scrollToBottom()` - Scroll to bottom of page
- `TestHelpers.attachTestId(testInfo, identifier)` - Attach test identifier

## Example Test

```javascript
// @ts-check
import { test, expect, setupTest } from '../../../../../helpers/base.js';
import { TestHelpers } from '../../../../../helpers/common.js';

let helpers;

test.beforeEach(async ({ page }) => {
    helpers = await setupTest(page);
});

test.describe('Login Tests', () => {
    test('should login successfully', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'validLogin');

        await helpers.login();
        await helpers.verifyLoginSuccess();
    });

    test('should show error with invalid credentials', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'invalidLogin');

        await helpers.login('invalid@email.com', 'wrongpassword');
        await helpers.verifyLoginFailure();
    });
});
```

## Benefits

1. **Consistency** - All tests use the same selectors and patterns
2. **Maintainability** - Changes to selectors only need to be made in one place
3. **Readability** - Tests focus on business logic rather than implementation details
4. **Reusability** - Common flows can be reused across different test suites
5. **Environment Variables** - Centralized credential management

## Environment Variables

Set these in your `.env` file or environment:
- `TEST_USER_EMAIL` - Email for test user account
- `TEST_USER_PASSWORD` - Password for test user account

## Selectors

The helpers use flexible regex-based selectors that work with both Italian and English text:
- Login links: `/login|accedi|sign in/i`
- Email inputs: `/email|e-mail/i`
- Password inputs: `/password|parola/i`
- Logout links: `/logout|esci/i`

This makes the tests more robust and language-agnostic.
