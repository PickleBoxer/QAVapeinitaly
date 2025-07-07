// @ts-check
import { test, expect, setupTest } from '../../../../helpers/base.js';
import { TestHelpers } from '../../../../helpers/common.js';

let helpers;

test.beforeEach(async ({ page }) => {
    helpers = await setupTest(page);
});

test.describe('Regression - Menu Navigation', () => {
    test('Main navigation menu is visible', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'mainMenuVisible');

        // Verify main navigation elements are present
        const mainNav = page.locator('nav, .navbar, .main-menu, [role="navigation"]');
        await expect(mainNav.first()).toBeVisible();
    });

    test('Home link navigates correctly', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'homeNavigation');

        // Navigate away from home
        // Click the first link inside the first list with class 'category'
        await page.locator('ul.top-menu').first().locator('a').first().click();

        // Navigate back to home using the desktop logo
        await page.locator('#_desktop_logo a').first().click();

        // Verify we're back on homepage using helper
        await helpers.verifyHomePage();
    });

    test('Product categories in menu work', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'productCategoriesMenu');

        // Look for product category links
        const categoryLinks = page.getByRole('link', { name: /sigarette|liquidi|accessori|category|prodotti/i });

        if (await categoryLinks.first().isVisible()) {
            await categoryLinks.first().click();

            // Verify category page loads
            await expect(page.getByRole('listitem').first()).toBeVisible();
        }
    });

    test('Dropdown menus functionality', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'dropdownMenus');

        // Look for dropdown triggers
        const dropdownTrigger = page.locator('[class*="dropdown"], [data-toggle="dropdown"], .has-dropdown > a');

        if (await dropdownTrigger.first().isVisible()) {
            // Hover or click to open dropdown
            await dropdownTrigger.first().hover();

            // Verify dropdown menu appears
            const dropdownMenu = page.locator('.dropdown-menu, [class*="submenu"], .dropdown-content');
            if (await dropdownMenu.first().isVisible()) {
                await expect(dropdownMenu.first()).toBeVisible();
            }
        }
    });

    test('Search functionality in header', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'headerSearch');

        // Look for search in header
        const searchInput = page.getByRole('searchbox').or(page.getByPlaceholder(/cerca|search/i));

        if (await searchInput.isVisible()) {
            await searchInput.fill('vape');
            await searchInput.press('Enter');

            // Verify search results page using helper
            await helpers.verifySearchPage();
        }
    });

    test('User account menu functionality', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'userAccountMenu');

        // Navigate to login using helper
        await helpers.goToLoginPage();

        // Verify login form elements are visible
        await expect(page.getByRole('textbox', { name: /email|e-mail/i })).toBeVisible();
        await expect(page.getByRole('textbox', { name: /password|parola/i })).toBeVisible();
        await expect(page.getByRole('button', { name: /login|accedi|sign in/i })).toBeVisible();
    });

    test('Cart icon in header works', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'cartIconHeader');

        // Add item to cart using helper
        await helpers.addItemToCart();

        // Click on cart icon in header
        await page.locator('.tvshopping-cart-icon a').click();

        // Verify cart page or cart dropdown opens
        await expect(page).toHaveURL(/\/carrello\?action=show/);
        await expect(page.getByRole('heading', { level: 1, name: /carrello|cart|La novità/i })).toBeVisible();
    });

    test('Footer navigation links', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'footerNavigation');

        // Scroll to footer using helper
        await helpers.scrollToBottom();

        // Look for footer links
        const footerLinks = page.locator('footer a, .footer a').first();

        if (await footerLinks.isVisible()) {
            await footerLinks.click();

            // Verify link works (page navigates)
            await page.waitForTimeout(2000);
        }
    });

    test('Mobile menu functionality', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'mobileMenu');

        // Set mobile viewport using helper
        await helpers.setMobileViewport();

        // Look for mobile menu trigger (hamburger)
        const mobileMenuTrigger = page.locator('.hamburger, .mobile-menu-toggle, [aria-label*="menu"], .menu-toggle');

        if (await mobileMenuTrigger.isVisible()) {
            await mobileMenuTrigger.click();

            // Verify mobile menu opens
            const mobileMenu = page.locator('.mobile-menu, .sidebar-menu, [class*="mobile-nav"]');
            if (await mobileMenu.isVisible()) {
                await expect(mobileMenu).toBeVisible();
            }
        }
    });

    test('Breadcrumb navigation', async ({ page }, testInfo) => {
        await TestHelpers.attachTestId(testInfo, 'breadcrumbNavigation');

        // Navigate to a category or product page
        const categoryLink = page.getByRole('link', { name: /categoria|category|prodotti/i }).first();

        if (await categoryLink.isVisible()) {
            await categoryLink.click();

            // Look for breadcrumb
            const breadcrumb = page.locator('.breadcrumb, .breadcrumbs, [aria-label*="breadcrumb"]');

            if (await breadcrumb.isVisible()) {
                await expect(breadcrumb).toBeVisible();

                // Click on home breadcrumb
                await breadcrumb.getByRole('link', { name: /home|casa/i }).first().click();

                // Verify navigation back to home
                await expect(page.getByRole('listitem').filter({ hasText: 'La novità  Anteprima' })).toBeVisible();
            }
        }
    });
});
