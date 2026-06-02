import { TEST_USERS } from '../support/helpers/testData';
import LoginPage from '../support/pages/LoginPage';
import InventoryPage from '../support/pages/InventoryPage';

describe('Special User Types - Sauce Demo', () => {
  beforeEach(() => {
    LoginPage.visit();
  });

  describe('Locked Out User', () => {
    it('should show error message and prevent login', () => {
      const { username, password } = TEST_USERS.lockedOut;
      LoginPage.verifyLoginPageDisplayed();
      LoginPage.login(username, password);
      LoginPage.verifyErrorMessage('Epic sadface');
    });

    it('should not navigate to inventory page', () => {
      const { username, password } = TEST_USERS.lockedOut;
      LoginPage.login(username, password);
      cy.url().should('include', '/index.html');
    });
  });

  describe('Problem User', () => {
    it('should login successfully despite image loading issues', () => {
      const { username, password } = TEST_USERS.problemUser;
      LoginPage.login(username, password);
      LoginPage.verifyLoginSuccess();
    });

    it('should display inventory but may have image issues', () => {
      const { username, password } = TEST_USERS.problemUser;
      LoginPage.login(username, password);
      InventoryPage.verifyProductsDisplayed();
      // Problem user has broken image paths but products should still be accessible
      cy.get('.inventory_item').should('exist');
    });
  });

  describe('Performance Glitch User', () => {
    it('should login successfully with slower page loads', () => {
      const { username, password } = TEST_USERS.performanceGlitch;
      LoginPage.login(username, password);
      // Extended timeout for performance glitch user
      cy.url().should('include', '/inventory.html', { timeout: 10000 });
    });

    it('should handle slower interactions', () => {
      const { username, password } = TEST_USERS.performanceGlitch;
      LoginPage.login(username, password);
      // Products should eventually load despite slowness
      cy.get('.inventory_item', { timeout: 10000 }).should('exist');
      cy.get('[data-test="add-to-cart-sauce-labs-backpack"]', { timeout: 10000 })
        .should('exist');
    });
  });

  describe('Visual User', () => {
    it('should login successfully', () => {
      const { username, password } = TEST_USERS.visualUser;
      LoginPage.login(username, password);
      LoginPage.verifyLoginSuccess();
    });

    it('should display inventory normally for visual regression testing', () => {
      const { username, password } = TEST_USERS.visualUser;
      LoginPage.login(username, password);
      InventoryPage.verifyProductsDisplayed();
      // Visual user is for visual regression testing - UI should render normally
      cy.get('.inventory_item').should('have.length.greaterThan', 0);
    });
  });

  describe('Standard User (Baseline)', () => {
    it('should login successfully', () => {
      const { username, password } = TEST_USERS.standard;
      LoginPage.login(username, password);
      LoginPage.verifyLoginSuccess();
    });

    it('should have all features accessible', () => {
      const { username, password } = TEST_USERS.standard;
      LoginPage.login(username, password);
      InventoryPage.verifyProductsDisplayed();
      cy.get('[data-test="bm-menu-button"]').should('be.visible');
    });
  });
});
