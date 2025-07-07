// @ts-check
import { test, expect } from '@playwright/test';
import { TestHelpers } from '../../../../helpers/common.js';

let helpers;

test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await page.goto('https://vapeinitaly.com/');
});

test.describe('Sanity - Cookie Consent Module', () => {
    test('Cookie Consent pop-up appears and can be accepted', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'cookieConsentPopup');

        // Add Cookie of Age Verification pop-up to bypass it
        await page.context().addCookies([{ name: 'an_age_verification', value: '1', domain: 'vapeinitaly.com', path: '/' }]);
        // Add Cookie of MailChimp pop-up to bypass it
        await page.context().addCookies([{ name: 'MCPopupClosed', value: 'yes', domain: 'vapeinitaly.com', path: '/' }]);

        await expect(page.locator('div').filter({ hasText: 'Questo sito web utilizza' }).nth(3)).toBeVisible();
        await helpers.handleCookieConsent();
    });

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

    test('Cookie preferences can be managed', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'manageCookiePreferences');

        // Setup cookies to bypass other popups
        await helpers.setupCookies();

        // Click the link with id 'lgcookieslaw_customize_cookies_link'
        await page.click('#lgcookieslaw_customize_cookies_link');

        // Verify the cookie preferences modal is visible
        await expect(page.locator('.fancybox-wrap #lgcookieslaw_modal')).toBeVisible();
    });

    test('All popups are handled in correct order', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'allPopupsOrder');

        // Start fresh without any cookies
        await page.reload();

        await page.mouse.move(0, 0);

        // Age verification should appear first
        await expect(page.getByText('Sei Maggiorenne? Per')).toBeVisible();
        await helpers.handleAgeVerification();

        // Cookie consent should appear after age verification
        await expect(page.locator('div').filter({ hasText: 'Questo sito web utilizza' }).nth(3)).toBeVisible();
        await helpers.handleCookieConsent();
    });
});
