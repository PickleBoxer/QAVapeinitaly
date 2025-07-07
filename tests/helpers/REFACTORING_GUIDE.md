# Test Refactoring Guide

This guide shows how to refactor existing tests to use the new helper utilities.

## Before vs After Examples

### 1. Basic Test Setup

**Before:**
```javascript
test.beforeEach(async ({ page }) => {
    await page.goto('https://vapeinitaly.com/');
    await page.context().addCookies([
        { name: 'an_age_verification', value: '1', domain: 'vapeinitaly.com', path: '/' },
        { name: 'MCPopupClosed', value: 'yes', domain: 'vapeinitaly.com', path: '/' }
    ]);
});
```

**After:**
```javascript
import { setupTest } from '../../../../../helpers/base.js';

let helpers;

test.beforeEach(async ({ page }) => {
    helpers = await setupTest(page);
});
```

### 2. Login Test

**Before:**
```javascript
test('should login with valid credentials', async ({ page }, testInfo) => {
    await testInfo.attach('testIdentifier', { body: 'validLogin', contentType: 'text/plain' });

    await page.getByRole('link', { name: /login|accedi|sign in/i }).first().click();
    
    const email = process.env.TEST_USER_EMAIL || 'test@example.com';
    const password = process.env.TEST_USER_PASSWORD || 'testpassword';

    await page.getByRole('textbox', { name: /email|e-mail/i }).fill(email);
    await page.getByRole('textbox', { name: /password|parola/i }).fill(password);
    await page.getByRole('button', { name: /login|accedi|sign in/i }).click();

    await expect(page.getByRole('link', { name: /logout|esci|account|profilo/i })).toBeVisible({ timeout: 10000 });
});
```

**After:**
```javascript
test('should login with valid credentials', async ({ page }, testInfo) => {
    await TestHelpers.attachTestId(testInfo, 'validLogin');

    await helpers.login();
    await helpers.verifyLoginSuccess();
});
```

### 3. Logout Test

**Before:**
```javascript
test('should logout via header', async ({ page }, testInfo) => {
    await testInfo.attach('testIdentifier', { body: 'logoutViaHeader', contentType: 'text/plain' });

    // Login first
    await page.getByRole('link', { name: /login|accedi|sign in/i }).first().click();
    // ... login code ...

    // Logout
    await page.getByRole('link', { name: /logout|esci/i }).first().click();
    await expect(page.getByRole('link', { name: /login|accedi|sign in/i })).toBeVisible();
});
```

**After:**
```javascript
test('should logout via header', async ({ page }, testInfo) => {
    await TestHelpers.attachTestId(testInfo, 'logoutViaHeader');

    await helpers.login();
    await helpers.verifyLoginSuccess();
    
    await helpers.logoutViaHeader();
    await helpers.verifyLogoutSuccess();
});
```

### 4. Cart Tests

**Before:**
```javascript
test('should add item to cart', async ({ page }, testInfo) => {
    await testInfo.attach('testIdentifier', { body: 'addToCart', contentType: 'text/plain' });

    await page.getByRole('listitem').filter({ hasText: /La novità|Anteprima/i }).getByRole('button').first().click();
    await page.getByRole('button', { name: /Aggiungi al carrello|Add to cart/i }).click();
    await page.getByRole('button', { name: /Continua lo shopping|Continue shopping/i }).click();

    const cartElement = page.locator('.tvcart-product-wrapper');
    await page.hover('#tvcms_cart_button');
    await expect(cartElement).toBeVisible({ timeout: 10000 });
});
```

**After:**
```javascript
test('should add item to cart', async ({ page }, testInfo) => {
    await TestHelpers.attachTestId(testInfo, 'addToCart');

    await helpers.addItemToCart();
    await helpers.verifyCartHasItems();
});
```

### 5. Popup Handling

**Before:**
```javascript
test('can handle age verification', async ({ page }, testInfo) => {
    await testInfo.attach('testIdentifier', { body: 'ageVerification', contentType: 'text/plain' });

    await page.context().addCookies([{ name: 'MCPopupClosed', value: 'yes', domain: 'vapeinitaly.com', path: '/' }]);
    await page.mouse.move(0, 0);

    await expect(page.getByText('Sei Maggiorenne? Per')).toBeVisible();
    await page.getByRole('link', { name: 'Si, ho più di 18 anni' }).click();
    await expect(page.getByText('Sei Maggiorenne? Per')).not.toBeVisible();
});
```

**After:**
```javascript
test('can handle age verification', async ({ page }, testInfo) => {
    await TestHelpers.attachTestId(testInfo, 'ageVerification');

    await page.context().addCookies([{ name: 'MCPopupClosed', value: 'yes', domain: 'vapeinitaly.com', path: '/' }]);
    await page.mouse.move(0, 0);

    await expect(page.getByText('Sei Maggiorenne? Per')).toBeVisible();
    await helpers.handleAgeVerification();
    await expect(page.getByText('Sei Maggiorenne? Per')).not.toBeVisible();
});
```

## Step-by-Step Refactoring Process

### 1. Update Imports
```javascript
// Add these imports at the top
import { test, expect, setupTest } from '../../../../../helpers/base.js';
import { TestHelpers } from '../../../../../helpers/common.js';
```

### 2. Replace beforeEach
```javascript
// Replace existing beforeEach with:
let helpers;

test.beforeEach(async ({ page }) => {
    helpers = await setupTest(page);
});
```

### 3. Update Test Identifiers
```javascript
// Replace:
await testInfo.attach('testIdentifier', { body: 'testId', contentType: 'text/plain' });

// With:
await TestHelpers.attachTestId(testInfo, 'testId');
```

### 4. Replace Common Patterns

#### Login Flow
Replace navigation + form filling + submission with:
```javascript
await helpers.login(); // Uses default credentials
// or
await helpers.login('custom@email.com', 'custompass'); // Custom credentials
```

#### Page Verification
Replace body selector checks with:
```javascript
await helpers.verifyHomePage();        // body#index
await helpers.verifyAuthenticationPage(); // body#authentication
await helpers.verifySearchPage();     // body#search
```

#### Logout
Replace logout button clicks with:
```javascript
await helpers.logoutViaHeader();
// or
await helpers.logoutViaAccountPage();
```

## Migration Checklist

- [ ] Update imports to use helpers
- [ ] Replace beforeEach with setupTest
- [ ] Update test identifiers to use attachTestId
- [ ] Replace login flows with helpers.login()
- [ ] Replace logout flows with helpers.logout methods
- [ ] Replace page verifications with helpers.verify methods
- [ ] Replace cart operations with helpers.addItemToCart()
- [ ] Replace popup handling with helpers.handle methods
- [ ] Test the refactored file to ensure it works
