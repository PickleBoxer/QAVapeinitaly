// @ts-check
import { test, expect } from '@playwright/test';
import { TestHelpers } from './common.js';

/**
 * Create helpers instance for a page
 * @param {import('@playwright/test').Page} page 
 * @returns {TestHelpers}
 */
export function createHelpers(page) {
    return new TestHelpers(page);
}

/**
 * Common beforeEach setup for tests
 * @param {import('@playwright/test').Page} page 
 * @returns {Promise<TestHelpers>}
 */
export async function setupTest(page) {
    const helpers = new TestHelpers(page);
    await helpers.goToHomepage();
    return helpers;
}

export { test, expect };
