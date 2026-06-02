# Sauce Demo Cypress Test Suite

## Overview
Comprehensive E2E test suite for https://www.saucedemo.com/ (practice e-commerce application).

## Test Scenarios Covered
- **Authentication**: Login, logout, invalid credentials, special user types
- **Product Browsing**: Product list display, sorting, filtering, product details
- **Shopping Cart**: Add/remove items, quantity updates, cart totals
- **Checkout**: Form submission, order review, completion
- **Edge Cases**: Special user behavior (locked_out, problem_user, performance_glitch_user)

## Available Test Users
Sauce Demo provides predefined users with different behaviors:
- **standard_user** - Normal user with all features enabled
- **locked_out_user** - Cannot log in
- **problem_user** - Has visual issues with image loading
- **performance_glitch_user** - Slower page load times
- **visual_user** - Visual regression testing user

All users use password: `secret_sauce`

## Directory Structure
```
cypress/
├── e2e/                    # Test specification files
│   ├── auth.spec.cy.js
│   ├── products.spec.cy.js
│   ├── cart.spec.cy.js
│   ├── checkout.spec.cy.js
│   └── userTypes.spec.cy.js
├── support/
│   ├── pages/              # Page Objects
│   │   ├── LoginPage.js
│   │   ├── InventoryPage.js
│   │   ├── CartPage.js
│   │   └── CheckoutPage.js
│   └── helpers/            # Utilities
│       ├── testData.js
│       └── commonHelpers.js
└── fixtures/               # Test data files
```

## Running Tests

### Run all tests
```bash
npm run test
# or
npm run cypress:run
```

### Open Cypress UI
```bash
npm run cypress:open
```

### Run specific test file
```bash
npx cypress run --spec "cypress/e2e/auth.spec.cy.js"
```

### Run with specific user
Tests are organized by user type. To focus on a specific scenario:
```bash
npx cypress run --spec "cypress/e2e/userTypes.spec.cy.js"
```

## Test Architecture

### Page Object Model (POM)
Each page has a dedicated page object that encapsulates selectors and interactions.

### Reusable Helpers
Common functions like login(), addToCart(), etc. are centralized in commonHelpers.js for DRY tests.

### Test Data
Credentials and constants are managed in testData.js to avoid hardcoding.

## Key Test Data
- Base URL: https://www.saucedemo.com
- Standard password: `secret_sauce`
- Common products: Backpack, Bike Light, Bolt T-Shirt, Fleece Jacket, Onesie, Red T-Shirt

## Configuration
See cypress.config.js for:
- Browser settings
- Timeouts
- Base URL
- Video/screenshot settings
