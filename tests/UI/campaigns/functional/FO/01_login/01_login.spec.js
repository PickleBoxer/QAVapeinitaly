// @ts-check
import { test, expect, setupTest } from '../../../../../helpers/base.js';
import { TestHelpers } from '../../../../../helpers/common.js';

const baseContext = 'functional_FO_login_login';

let helpers;

test.beforeEach(async ({ page }) => {
    helpers = await setupTest(page);
});

test.describe('FO - Login: Login functionality', () => {
    test('should go to login page', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'goToLoginPage');

        await helpers.goToLoginPage();
        // URL verification is already included in goToLoginPage method
    });

    test('should display login form', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'displayLoginForm');

        await helpers.goToLoginPage();

        // Verify login form elements are visible
        await expect(page.getByRole('textbox', { name: /email|e-mail/i })).toBeVisible();
        await expect(page.getByRole('textbox', { name: /password|parola/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /login|accedi|sign in/i })).toBeVisible();
    });

    test('should show error with invalid credentials', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'invalidCredentials');

        await helpers.login('invalid@email.com', 'wrongpassword');
        await helpers.verifyLoginFailure();
    });

    test('should show error with invalid email format', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'invalidEmailFormat');

        await helpers.goToLoginPage();
        await helpers.fillLoginForm('invalidemail', 'somepassword');
        await helpers.submitLoginForm();

        // Verify browser's native validation feedback for invalid email
        const emailInput = page.getByRole('textbox', { name: /email|e-mail/i });
        await emailInput.evaluate(input => {
            if (input instanceof HTMLInputElement) {
                input.reportValidity();
            }
        });
        const validity = await emailInput.evaluate(input => 
            input instanceof HTMLInputElement ? input.validity.typeMismatch : false
        );
        expect(validity).toBe(true);
    });

    test('should toggle password visibility', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'togglePasswordVisibility');

        await helpers.goToLoginPage();

        const passwordInput = page.getByRole('textbox', { name: /password|parola/i });

        // Verify password field is initially hidden
        await expect(passwordInput).toHaveAttribute('type', 'password');

        // Click show password button if available
        const showPasswordButton = page.getByRole('button', { name: /show|mostra|eye/i }).first();
        if (await showPasswordButton.isVisible()) {
            await showPasswordButton.click();
            await expect(passwordInput).toHaveAttribute('type', 'text');
        }
    });

    test('should login with valid credentials', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'validLogin');

        await helpers.login();
        await helpers.verifyLoginSuccess();
    });

    test('should maintain cart contents after login', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'maintainCartAfterLogin');

        // Add item to cart before login
        await helpers.addItemToCart();

        // Login with valid credentials
        await helpers.login();
        await helpers.verifyLoginSuccess();

        // Verify cart contents are maintained
        await helpers.verifyCartHasItems();
    });
});
