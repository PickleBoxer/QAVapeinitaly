// @ts-check
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('https://vapeinitaly.com/');
});
test.describe('Age Verification module', async () => {
  test('Shows Age Verification pop-up when MailChimp cookie is set', async ({ page }, testInfo) => {
    await testInfo.attach('testIdentifier', {body: 'Vapeinitaly.com', contentType: 'text/plain'});
    // Add Cookie of MailChimp pop-up
    await page.context().addCookies([{ name: 'MCPopupClosed', value: 'yes', domain: 'vapeinitaly.com', path: '/' }]);
    // Move mouse to trigger pop-up if needed
    await page.mouse.move(0, 0);

    await expect(page.getByText('Sei Maggiorenne? Per')).toBeVisible();
  });

  test('Can click link in Age Verification pop-up', async ({ page }, testInfo) => {
    await testInfo.attach('testIdentifier', {body: 'Vapeinitaly.com', contentType: 'text/plain'});
    // Add Cookie of MailChimp pop-up
    await page.context().addCookies([{ name: 'MCPopupClosed', value: 'yes', domain: 'vapeinitaly.com', path: '/' }]);
    await page.mouse.move(0, 0);

    await expect(page.getByText('Sei Maggiorenne? Per')).toBeVisible();
    await page.getByRole('link', { name: 'Si, ho più di 18 anni' }).click();
  });

  test('Age Verification pop-up disappears after accepting', async ({ page }, testInfo) => {
    await testInfo.attach('testIdentifier', {body: 'Vapeinitaly.com', contentType: 'text/plain'});
    // Add Cookie of MailChimp pop-up
    await page.context().addCookies([{ name: 'MCPopupClosed', value: 'yes', domain: 'vapeinitaly.com', path: '/' }]);
    await page.mouse.move(0, 0);

    await expect(page.getByText('Sei Maggiorenne? Per')).toBeVisible();
    await page.getByRole('link', { name: 'Si, ho più di 18 anni' }).click();
    await expect(page.getByText('Sei Maggiorenne? Per')).not.toBeVisible();
  });

  test('Does not show Age Verification pop-up if cookie is set', async ({ page }, testInfo) => {
    await testInfo.attach('testIdentifier', {body: 'Vapeinitaly.com', contentType: 'text/plain'});
    // Add Cookie of Age Verification pop-up
    await page.context().addCookies([{ name: 'an_age_verification', value: '1', domain: 'vapeinitaly.com', path: '/' }]);
    await page.mouse.move(0, 0);

    await expect(page.getByText('Sei Maggiorenne? Per')).not.toBeVisible();
  });
});

test.describe('Cookie module - Show Pop-up', async () => {
  test('Cookie Consent pop-up', async ({ page }, testInfo) => {
    await testInfo.attach('testIdentifier', {body: 'Vapeinitaly.com', contentType: 'text/plain'});
    // Add Cookie of Age Verification pop-up
    await page.context().addCookies([{ name: 'an_age_verification', value: '1', domain: 'vapeinitaly.com', path: '/' }]);
    // Add Cookie of MailChimp pop-up
    await page.context().addCookies([{ name: 'MCPopupClosed', value: 'yes', domain: 'vapeinitaly.com', path: '/' }]);

    await expect(page.locator('div').filter({ hasText: 'Questo sito web utilizza' }).nth(3)).toBeVisible();
    await page.getByRole('button', { name: 'Accetto' }).click();
  });
});

test.describe('Cookie module - Show Pop-up', async () => {
  test('MailChimp pop-up', async ({ page }, testInfo) => {
    await testInfo.attach('testIdentifier', {body: 'Vapeinitaly.com', contentType: 'text/plain'});
    // Add Cookie of Age Verification pop-up
    await page.context().addCookies([{ name: 'an_age_verification', value: '1', domain: 'vapeinitaly.com', path: '/' }]);

    // move a mouse
    await page.mouse.move(0, 0);

    // wait for a MailChimp pop-up to appear
    await expect(page.locator('#PopupSignupForm_0 iframe').nth(1).contentFrame().locator('#SignupForm_0')).toBeVisible({ timeout: 25_000 });
    await page.getByRole('button', { name: 'Close' }).click();
  });
});

test.describe('Payment Option - Show Payment Options', async () => {
  test('Payment Option Matched Aria Snapshot', async ({ page }, testInfo) => {
    await testInfo.attach('testIdentifier', {body: 'Vapeinitaly.com', contentType: 'text/plain'});
    // Add Cookie of Age Verification pop-up
    await page.context().addCookies([{ name: 'an_age_verification', value: '1', domain: 'vapeinitaly.com', path: '/' }]);
    // Add Cookie of MailChimp pop-up
    await page.context().addCookies([{ name: 'MCPopupClosed', value: 'yes', domain: 'vapeinitaly.com', path: '/' }]);

    await page.getByRole('listitem').filter({ hasText: 'La novità  Anteprima' }).getByRole('button').click();
    await page.getByRole('button', { name: ' Aggiungi al carrello' }).click();
    await page.getByRole('link', { name: ' Procedi con il checkout' }).click();
    await page.getByRole('link', { name: 'Procedi con il checkout' }).click();
    await page.getByRole('tab', { name: 'Login' }).click();
    await expect(page.getByText('Login E-mail Parola d\'ordine')).toBeVisible();
    await page.getByRole('textbox', { name: 'E-mail' }).click();
    await page.getByRole('textbox', { name: 'E-mail' }).fill(process.env.TEST_USER_EMAIL || 'your-email@example.com');
    await page.getByRole('textbox', { name: 'Parola d\'ordine' }).click();
    await page.getByRole('textbox', { name: 'Parola d\'ordine' }).fill(process.env.TEST_USER_PASSWORD || 'your-password');
    await page.getByRole('button', { name: 'Registrazione' }).click();
    await expect(page.locator('#payment-option-1-container')).toBeVisible();
    await page.locator('#payment-option-1-container').click();
    await expect(page.locator('#pay-with-payment-option-1-form')).toBeVisible();
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
});
