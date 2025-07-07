# Playwright Test Organization for Vapeinitaly.com

## Test Structure Overview

The tests have been reorganized into a logical structure based on test types and functional areas:

```
tests/
└── UI/
    └── campaigns/
        ├── functional/
        │   └── FO/
        │       └── 01_login/
        │           ├── 01_login.spec.js
        │           └── 02_logout.spec.js
        ├── regression/
        │   ├── checkout/
        │   │   └── 01_checkoutFlow.spec.js
        │   └── menu/
        │       └── 01_navigation.spec.js
        ├── sanity/
        │   ├── 01_ageVerification/
        │   │   └── 01_ageVerification.spec.js
        │   ├── 02_cookieConsent/
        │   │   └── 01_cookieConsent.spec.js
        │   ├── 03_catalogFO/
        │   │   └── 01_catalog.spec.js
        │   ├── 04_cartFO/
        │   │   └── 01_cart.spec.js
        │   └── 05_checkoutFO/
        │       └── 01_checkout.spec.js
        ├── 01_test.spec.js (original - can be removed)
        └── 01_test_refactored.spec.js (integration tests)
```

## Test Categories

### 1. Functional Tests (`functional/FO/`)
Tests that verify specific functionality works as expected:
- **01_login/**: Login and logout functionality
  - `01_login.spec.js`: Login form validation, credentials testing, password visibility
  - `02_logout.spec.js`: Logout from different pages, session verification

### 2. Regression Tests (`regression/`)
Tests that ensure existing functionality continues to work:
- **checkout/**: Complete checkout flow testing
  - `01_checkoutFlow.spec.js`: End-to-end checkout process, payment validation
- **menu/**: Navigation and menu functionality
  - `01_navigation.spec.js`: Menu navigation, breadcrumbs, mobile menu

### 3. Sanity Tests (`sanity/`)
Quick tests to verify basic functionality:
- **01_ageVerification/**: Age verification popup functionality
- **02_cookieConsent/**: Cookie consent and MailChimp popup handling
- **03_catalogFO/**: Product catalog and search functionality
- **04_cartFO/**: Shopping cart operations
- **05_checkoutFO/**: Basic checkout page functionality

## Key Features of the New Structure

### Environment Variables
All tests use environment variables for sensitive data:
- `TEST_USER_EMAIL`: Email for test login
- `TEST_USER_PASSWORD`: Password for test login

### Popup Handling
Each test file properly handles the site's popups:
- Age verification popup (cookie: `an_age_verification`)
- MailChimp popup (cookie: `MCPopupClosed`)

### Test Identifiers
Each test includes a unique identifier for tracking and reporting.

### Responsive Design
Tests include viewport testing for mobile, tablet, and desktop.

## Running Tests

### Run all tests:
```bash
npx playwright test
```

### Run specific test categories:
```bash
# Run only functional tests
npx playwright test tests/UI/campaigns/functional/

# Run only sanity tests
npx playwright test tests/UI/campaigns/sanity/

# Run only regression tests
npx playwright test tests/UI/campaigns/regression/
```

### Run specific test files:
```bash
# Run login tests
npx playwright test tests/UI/campaigns/functional/FO/01_login/

# Run cart tests
npx playwright test tests/UI/campaigns/sanity/04_cartFO/
```

## Test Data Requirements

Before running tests, ensure you have:
1. Valid test user credentials set in environment variables
2. Test products available on the site (specifically "La novità Anteprima")
3. Checkout functionality properly configured

## Maintenance Notes

### Adding New Tests
- **Functional tests**: Add to appropriate FO subfolder
- **Regression tests**: Add to checkout, menu, or create new category
- **Sanity tests**: Add numbered folders for new features

### Updating Selectors
When the site changes, update selectors in the relevant test files. Common selectors are used across tests for consistency.

### Performance Considerations
Tests are designed to run efficiently by:
- Setting cookies upfront to bypass popups
- Using appropriate timeouts
- Reusing page instances within test suites

## Migration from Original Structure

The original `01_test.spec.js` contained mixed test types. These have been separated into:
1. **Age verification tests** → `sanity/01_ageVerification/`
2. **Cookie tests** → `sanity/02_cookieConsent/`  
3. **Checkout tests** → `regression/checkout/`
4. **Integration tests** → `01_test_refactored.spec.js`

This organization makes tests easier to:
- Maintain and update
- Run selectively based on needs
- Debug when failures occur
- Scale as the application grows
