// @ts-check
import { test, expect } from '@playwright/test';
import { TestHelpers } from '../../../../helpers/common.js';

let helpers;

test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page);
    await page.goto('https://vapeinitaly.com/');
});

test.describe('Sanity - Age Verification Module', () => {
    test('Shows Age Verification pop-up when MailChimp cookie is set', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'showAgeVerificationWithMailChimp');

        // Add Cookie of MailChimp pop-up
        await page.context().addCookies([{ name: 'MCPopupClosed', value: 'yes', domain: 'vapeinitaly.com', path: '/' }]);
        
        // Move mouse to trigger pop-up if needed
        await page.mouse.move(0, 0);

        await expect(page.getByText('Sei Maggiorenne? Per')).toBeVisible();
    });

    test('Can click link in Age Verification pop-up', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'clickAgeVerificationLink');

        // Add Cookie of MailChimp pop-up
        await page.context().addCookies([{ name: 'MCPopupClosed', value: 'yes', domain: 'vapeinitaly.com', path: '/' }]);
        await page.mouse.move(0, 0);

        await expect(page.getByText('Sei Maggiorenne? Per')).toBeVisible();
        await helpers.handleAgeVerification();
    });

    test('Age Verification pop-up disappears after accepting', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'ageVerificationDisappearsAfterAccept');

        // Add Cookie of MailChimp pop-up
        await page.context().addCookies([{ name: 'MCPopupClosed', value: 'yes', domain: 'vapeinitaly.com', path: '/' }]);
        await page.mouse.move(0, 0);

        await expect(page.getByText('Sei Maggiorenne? Per')).toBeVisible();
        await helpers.handleAgeVerification();
        await expect(page.getByText('Sei Maggiorenne? Per')).not.toBeVisible();
    });

    test('Does not show Age Verification pop-up if cookie is set', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'noAgeVerificationWithCookie');

        // Add Cookie of Age Verification pop-up
        await page.context().addCookies([{ name: 'an_age_verification', value: '1', domain: 'vapeinitaly.com', path: '/' }]);
        await page.mouse.move(0, 0);

        await expect(page.getByText('Sei Maggiorenne? Per')).not.toBeVisible();
    });
});
