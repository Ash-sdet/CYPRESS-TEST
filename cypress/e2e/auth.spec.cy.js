import { TEST_USERS } from '../support/helpers/testData';
import LoginPage from '../support/pages/LoginPage';
import InventoryPage from '../support/pages/InventoryPage';

describe('Authentication - Sauce Demo', () => {
  beforeEach(() => {
    LoginPage.visit();
  });

  describe('Valid Login', () => {
    it('should login successfully with valid credentials', () => {
      const { username, password } = TEST_USERS.standard;
      LoginPage.verifyLoginPageDisplayed();
      LoginPage.login(username, password);
      LoginPage.verifyLoginSuccess();
    });

    it('should display inventory after successful login', () => {
      const { username, password } = TEST_USERS.standard;
      LoginPage.login(username, password);
      InventoryPage.verifyProductsDisplayed();
    });

    it('should maintain session after login', () => {
      const { username, password } = TEST_USERS.standard;
      LoginPage.login(username, password);
      cy.url().should('include', '/inventory.html');
      // Reload page - session should persist
      cy.reload();
      cy.url().should('include', '/inventory.html');
    });
  });

  describe('Invalid Credentials', () => {
    it('should show error for invalid username', () => {
      LoginPage.login('invalid_user', 'secret_sauce');
      LoginPage.verifyErrorMessage('Epic sadface');
    });

    it('should show error for invalid password', () => {
      const { username } = TEST_USERS.standard;
      LoginPage.login(username, 'wrong_password');
      LoginPage.verifyErrorMessage('Epic sadface');
    });

    it('should not navigate to inventory on invalid login', () => {
      LoginPage.login('invalid_user', 'invalid_pass');
      cy.url().should('include', '/index.html');
    });

    it('should clear error message on username change', () => {
      LoginPage.login('invalid_user', 'secret_sauce');
      LoginPage.verifyErrorMessage('Epic sadface');
      LoginPage.enterUsername('valid_user');
      // Error should be cleared (check if your app implements this)
      LoginPage.verifyErrorMessageNotVisible();
    });
  });

  describe('Empty Fields', () => {
    it('should show error when both fields are empty', () => {
      LoginPage.clickLogin();
      LoginPage.verifyErrorMessage('Epic sadface');
    });

    it('should show error when username is empty', () => {
      LoginPage.enterPassword('secret_sauce');
      LoginPage.clickLogin();
      LoginPage.verifyErrorMessage('Epic sadface');
    });

    it('should show error when password is empty', () => {
      const { username } = TEST_USERS.standard;
      LoginPage.enterUsername(username);
      LoginPage.clickLogin();
      LoginPage.verifyErrorMessage('Epic sadface');
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      const { username, password } = TEST_USERS.standard;
      LoginPage.login(username, password);
      LoginPage.verifyLoginSuccess();
    });

    it('should logout successfully', () => {
      InventoryPage.logout();
      cy.url().should('include', '/index.html');
      LoginPage.verifyLoginPageDisplayed();
    });

    it('should redirect to login after logout', () => {
      InventoryPage.logout();
      // Try to access inventory directly - should redirect to login
      cy.visit('/inventory.html');
      cy.url().should('include', '/index.html');
    });
  });

  describe('Session Management', () => {
    it('should not allow access to inventory without login', () => {
      cy.visit('/inventory.html');
      cy.url().should('include', '/index.html');
    });

    it('should not allow access to cart without login', () => {
      cy.visit('/cart.html');
      cy.url().should('include', '/index.html');
    });
  });
});
