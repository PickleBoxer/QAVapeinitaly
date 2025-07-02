# Copilot Instructions for Playwright Project

## Project Overview

- This project uses [Playwright](https://playwright.dev/) for end-to-end browser testing.
- Tests are located in `tests/` (main suite) and `tests-examples/` (examples).
- The main configuration is in `playwright.config.js`, which sets up test directories, browser projects, and reporting.

## Key Patterns & Conventions

- **Test Structure:**  
- Use `test.describe` to group related tests.
- Each test uses the Playwright `test` API (`import { test, expect } from '@playwright/test'`).
- Common setup is done in `test.beforeEach`.
- Attachments (e.g., `testInfo.attach`) are used for test metadata.

- **Cookie Handling:**  
- Many tests manipulate cookies directly with `page.context().addCookies`.
- Example:  
```js
await page.context().addCookies([{ name: 'MCPopupClosed', value: 'yes', domain: 'vapeinitaly.com', path: '/' }]);
```

- **Selectors:**  
- Prefer Playwright's role and text selectors:  
- `page.getByRole('button', { name: 'Accetto' })`
- `page.getByText('Sei Maggiorenne? Per')`

## Developer Workflows

- **Install dependencies:**  
```
npm ci
npx playwright install --with-deps
```

- **Run all tests:**  
```
npx playwright test
```

- **View reports:**  
- After running tests, open `playwright-report/index.html` in a browser.

- **CI Integration:**  
- GitHub Actions workflow: `.github/workflows/playwright.yml`
- On push/PR to `main`/`master`, runs tests and uploads the HTML report as an artifact.

## Project-Specific Notes

- **Test Results:**  
- JSON reports are output to `results.json` (see `playwright.config.js`).
- Test run artifacts and results are stored in `playwright-report/` and `test-results/`.

- **Browser Projects:**  
- Only Chromium is enabled by default. Other browsers (Firefox, WebKit) are commented out but can be enabled in `playwright.config.js`.

- **Test Examples:**  
- `tests-examples/demo-todo-app.spec.js` provides Playwright usage patterns and can be used as a template.

## File References

- Main config: `playwright.config.js`
- Main tests: `campaigns\01_frontOffice\01_test.spec.js`
- Example tests: `tests-examples/demo-todo-app.spec.js`
- CI: `.github/workflows/playwright.yml`
