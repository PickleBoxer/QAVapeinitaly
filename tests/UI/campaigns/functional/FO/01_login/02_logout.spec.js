// @ts-check
import { test, expect, setupTest } from '../../../../../helpers/base.js';
import { TestHelpers } from '../../../../../helpers/common.js';

const baseContext = 'functional_FO_login_logout';

let helpers;

test.beforeEach(async ({ page }) => {
    helpers = await setupTest(page);
});

test.describe('FO - Login: Logout functionality', () => {
    test('should login and logout via header link', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'logoutViaHeader');

        // Login with valid credentials
        await helpers.login();
        await helpers.verifyLoginSuccess();

        // Logout via header link
        await helpers.logoutViaHeader();

        // Verify logout successful
        await helpers.verifyLogoutSuccess();
    });

    test('should login and logout via account page', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'logoutViaAccountPage');

        // Login with valid credentials
        await helpers.login();
        await helpers.verifyLoginSuccess();

        // Logout via account page
        await helpers.logoutViaAccountPage();

        // Verify logout successful - should be on authentication page
        await helpers.verifyAuthenticationPage();
    });

    test('should verify user session after logout', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'verifySessionAfterLogout');

        // Login with valid credentials
        await helpers.login();
        await helpers.verifyLoginSuccess();

        // Logout
        await helpers.logoutViaHeader();

        // Try to access a protected page (like account page) and verify redirect to login
        await page.goto('https://vapeinitaly.com/account');

        // Should be redirected to login page
        await helpers.verifyAuthenticationPage();
    });
});
