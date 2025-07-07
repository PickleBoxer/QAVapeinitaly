// @ts-check
import { expect } from '@playwright/test';

/**
 * Common test utilities for VapeInItaly tests
 */
export class TestHelpers {
    constructor(page) {
        this.page = page;
        this.baseUrl = 'https://vapeinitaly.com/';
        this.testCredentials = {
            email: process.env.TEST_USER_EMAIL || 'test@example.com',
            password: process.env.TEST_USER_PASSWORD || 'testpassword'
        };
    }

    /**
     * Setup cookies to bypass common popups
     */
    async setupCookies() {
        await this.page.context().addCookies([
            { name: 'an_age_verification', value: '1', domain: 'vapeinitaly.com', path: '/' },
            { name: 'MCPopupClosed', value: 'yes', domain: 'vapeinitaly.com', path: '/' }
        ]);
    }

    /**
     * Navigate to homepage with cookies setup
     */
    async goToHomepage() {
        await this.page.goto(this.baseUrl);
        await this.setupCookies();
    }

    /**
     * Navigate to login page
     */
    async goToLoginPage() {
        await this.page.getByRole('link', { name: /login|accedi|sign in/i }).first().click();
        await expect(this.page).toHaveURL(/\/login/i);
    }

    /**
     * Fill login form with credentials
     */
    async fillLoginForm(email = this.testCredentials.email, password = this.testCredentials.password) {
        await this.page.getByRole('textbox', { name: /email|e-mail/i }).fill(email);
        await this.page.getByRole('textbox', { name: /password|parola/i }).fill(password);
    }

    /**
     * Submit login form
     */
    async submitLoginForm() {
        await this.page.getByRole('button', { name: /login|accedi|sign in/i }).click();
    }

    /**
     * Complete login process (navigate, fill, submit)
     */
    async login(email = this.testCredentials.email, password = this.testCredentials.password) {
        await this.goToLoginPage();
        await this.fillLoginForm(email, password);
        await this.submitLoginForm();
    }

    /**
     * Verify successful login
     */
    async verifyLoginSuccess() {
        await expect(this.page.getByRole('link', { name: /logout|esci|account|profilo/i }))
            .toBeVisible({ timeout: 10000 });
    }

    /**
     * Verify login failure
     */
    async verifyLoginFailure() {
        await expect(this.page.locator('.alert-danger')).toBeVisible();
        await expect(this.page.locator('.alert-danger'))
            .toContainText(/(La tua autenticazione non è riuscita\.|Authentication failed\.)/i);
    }

    /**
     * Logout via header link
     */
    async logoutViaHeader() {
        await this.page.getByRole('link', { name: /logout|esci/i }).first().click();
    }

    /**
     * Logout via account page
     */
    async logoutViaAccountPage() {
        await this.page.locator('a.account').first().click();
        await this.page.getByRole('link', { name: /logout|esci|sign out/i }).nth(1).click();
    }

    /**
     * Verify successful logout
     */
    async verifyLogoutSuccess() {
        await expect(this.page.getByRole('link', { name: /login|accedi|sign in/i })).toBeVisible();
    }

    /**
     * Verify user is on authentication page
     */
    async verifyAuthenticationPage() {
        await expect(this.page.locator("body#authentication")).toBeVisible();
    }

    /**
     * Verify user is on home page
     */
    async verifyHomePage() {
        await expect(this.page.locator("body#index")).toBeVisible();
    }

    /**
     * Verify user is on search page
     */
    async verifySearchPage() {
        await expect(this.page.locator("body#search")).toBeVisible();
    }

    /**
     * Add item to cart (quick-view method)
     */
    async addItemToCart() {
        await this.page.getByRole('listitem').filter({ hasText: /La novità|Anteprima/i }).getByRole('button').first().click();
        await this.page.getByRole('button', { name: /Aggiungi al carrello|Add to cart/i }).click();
        await this.page.getByRole('button', { name: /Continua lo shopping|Continue shopping/i }).click();
    }

    /**
     * Add item to cart and proceed to checkout (quick-view method)
     */
    async addItemToCartAndCheckout() {
        await this.page.getByRole('listitem').filter({ hasText: /La novità|Anteprima/i }).getByRole('button').first().click();
        await this.page.getByRole('button', { name: /Aggiungi al carrello|Add to cart/i }).click();
        await this.page.getByRole('link', { name: /Procedi con il checkout|Proceed to checkout/i }).click();
    }

    /**
     * Verify cart has items
     */
    async verifyCartHasItems() {
        const cartElement = this.page.locator('.tvcart-product-wrapper');
        await this.page.hover('#tvcms_cart_button');
        await expect(cartElement).toBeVisible({ timeout: 10000 });
    }

    /**
     * Handle cookie consent popup
     */
    async handleCookieConsent() {
        const cookieButton = this.page.getByRole('button', { name: 'Accetto' });
        if (await cookieButton.isVisible()) {
            await cookieButton.click();
        }
    }

    /**
     * Handle age verification popup
     */
    async handleAgeVerification() {
        const ageLink = this.page.getByRole('link', { name: 'Si, ho più di 18 anni' });
        if (await ageLink.isVisible()) {
            await ageLink.click();
        }
    }

    /**
     * Handle MailChimp popup
     */
    async handleMailChimpPopup() {
        const closeButton = this.page.getByRole('button', { name: 'Close' });
        if (await closeButton.isVisible()) {
            await closeButton.click();
        }
    }

    /**
     * Attach test identifier to test info
     */
    static attachTestId(testInfo, identifier) {
        return testInfo.attach('testIdentifier', { 
            body: identifier, 
            contentType: 'text/plain' 
        });
    }

    /**
     * Set mobile viewport
     */
    async setMobileViewport() {
        await this.page.setViewportSize({ width: 375, height: 667 });
    }

    /**
     * Scroll to bottom of page
     */
    async scrollToBottom() {
        await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    }

    /**
     * Common selectors object
     */
    static get selectors() {
        return {
            loginLink: 'link[name*="login" i], link[name*="accedi" i], link[name*="sign in" i]',
            emailInput: 'textbox[name*="email" i]',
            passwordInput: 'textbox[name*="password" i], textbox[name*="parola" i]',
            loginButton: 'button[name*="login" i], button[name*="accedi" i], button[name*="sign in" i]',
            logoutLink: 'link[name*="logout" i], link[name*="esci" i]',
            accountLink: 'link[name*="account" i], link[name*="profilo" i]',
            cartIcon: '.tvshopping-cart-icon a',
            addToCartButton: 'button[name*="Aggiungi al carrello" i], button[name*="Add to cart" i]',
            continueShoppingButton: 'button[name*="Continua lo shopping" i], button[name*="Continue shopping" i]'
        };
    }
}
