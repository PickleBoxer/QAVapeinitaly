// @ts-check
import { test, expect } from '@playwright/test';
import { TestHelpers } from '../../../../helpers/common.js';

let helpers;

test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await page.goto('https://vapeinitaly.com/');
});

test.describe('Sanity - MailChimp Module', () => {
    test('MailChimp pop-up appears and can be closed', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'mailChimpPopup');

        // Add Cookie of Age Verification pop-up to bypass it
        await page.context().addCookies([{ name: 'an_age_verification', value: '1', domain: 'vapeinitaly.com', path: '/' }]);

        // Move mouse to trigger MailChimp popup
        await page.mouse.move(0, 0);

        // Wait for MailChimp pop-up to appear
        await expect(page.locator('#PopupSignupForm_0 iframe').nth(1).contentFrame().locator('#SignupForm_0')).toBeVisible({ timeout: 25_000 });
        await helpers.handleMailChimpPopup();
    });
});
