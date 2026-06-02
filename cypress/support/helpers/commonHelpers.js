import { TEST_TIMEOUTS } from './testData.js';

// Navigation helpers
export function navigateTo(url) {
  cy.visit(url);
}

export function navigateToInventory() {
  cy.visit('/inventory.html');
}

export function navigateToCart() {
  cy.visit('/cart.html');
}

// Wait and assertion helpers
export function waitForElement(selector, timeout = TEST_TIMEOUTS.medium) {
  cy.get(selector, { timeout }).should('be.visible');
}

export function verifyElementExists(selector) {
  cy.get(selector).should('exist');
}

export function verifyElementText(selector, text) {
  cy.get(selector).should('contain.text', text);
}

export function verifyPageTitle(title) {
  cy.title().should('contain', title);
}

// Form helpers
export function fillInput(selector, text) {
  cy.get(selector).clear().type(text, { delay: 50 });
}

export function clickElement(selector) {
  cy.get(selector).click();
}

// Authentication helpers
export function login(username, password) {
  fillInput('[data-test="username"]', username);
  fillInput('[data-test="password"]', password);
  clickElement('[data-test="login-button"]');
  cy.url().should('include', '/inventory.html');
}

export function logout() {
  clickElement('[data-test="bm-menu-button"]');
  cy.get('[data-test="logout-sidebar-link"]', { timeout: TEST_TIMEOUTS.long }).click();
  cy.url().should('include', '/index.html');
}

// Cart helpers
export function addProductToCart(productName) {
  cy.contains('button', 'Add to cart').parent().contains(productName).parent().find('button').click();
}

export function removeProductFromCart(productName) {
  cy.contains('button', 'Remove').parent().contains(productName).parent().find('button').click();
}

export function getCartCount() {
  return cy.get('[data-test="shopping-cart-badge"]').invoke('text');
}
