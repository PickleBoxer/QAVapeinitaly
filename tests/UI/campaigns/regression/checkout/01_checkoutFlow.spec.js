// @ts-check
import { test, expect, setupTest } from '../../../../helpers/base.js';
import { TestHelpers } from '../../../../helpers/common.js';

let helpers;

test.beforeEach(async ({ page }) => {
    helpers = await setupTest(page);
});

test.describe('Regression - Checkout Flow', () => {
    test('Payment option selection and form validation', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'paymentOptionValidation');

        // Add product to cart using helper
        await helpers.addItemToCartAndCheckout();

        // Proceed to checkout
        await page.getByRole('link', { name: /Procedi con il checkout|Proceed to checkout/i }).click();

        // Login using helper
        await page.getByRole('tab', { name: 'Login' }).click();
        await expect(page.getByText('Login E-mail Parola d\'ordine')).toBeVisible();
        await helpers.fillLoginForm();
        await page.getByRole('button', { name: 'Registrazione' }).click();

        // Select payment option
        await expect(page.locator('#payment-option-1-container')).toBeVisible({ timeout: 10000 });
        await page.locator('#payment-option-1-container').click();

        // Verify payment form appears
        await expect(page.locator('#pay-with-payment-option-1-form')).toBeVisible();
    });

    test('Payment form Aria snapshot validation', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'paymentFormAriaSnapshot');

        // Add product to cart using helper
        await helpers.addItemToCartAndCheckout();

        // Login using helper
        await page.getByRole('tab', { name: 'Login' }).click();
        await expect(page.getByText('Login E-mail Parola d\'ordine')).toBeVisible();
        await helpers.fillLoginForm();
        await page.getByRole('button', { name: 'Registrazione' }).click();

        // Select payment option and validate Aria snapshot
        await expect(page.locator('#payment-option-1-container')).toBeVisible({ timeout: 10000 });
        await page.locator('#payment-option-1-container').click();
        await expect(page.locator('#pay-with-payment-option-1-form')).toBeVisible();

        // Validate the Aria snapshot for payment form
        await expect(page.locator('#pay-with-payment-option-1-form')).toMatchAriaSnapshot(`
    - img
    - img
    - img
    - img
    - img
    - img
    - paragraph: Paga in tutta sicurezza con carta di credito, debito e prepagata tramite Nexi.
    `);
    });

    test('Cart validation before checkout', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'cartValidationBeforeCheckout');

        // Try to proceed to checkout with empty cart
        await page.locator('#tvcms_cart_button a').click();

        // Verify empty cart message or inability to proceed
        const checkoutButton = page.locator('.checkout button');
        if (await checkoutButton.isVisible()) {
            await expect(checkoutButton).toBeDisabled();
        } else {
            await expect(page.getByText(/Non ci sono più articoli nel tuo carrello|empty cart|no items/i)).toBeVisible();
        }
    });
});
