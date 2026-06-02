export class LoginPage {
  // Selectors
  selectors = {
    usernameInput: '[data-test="username"]',
    passwordInput: '[data-test="password"]',
    loginButton: '[data-test="login-button"]',
    errorMessage: '[data-test="error"]',
    container: '.login_container'
  };

  // Navigation
  visit() {
    cy.visit('/');
  }

  // Element interactions
  enterUsername(username) {
    cy.get(this.selectors.usernameInput).clear().type(username, { delay: 50 });
    return this;
  }

  enterPassword(password) {
    cy.get(this.selectors.passwordInput).clear().type(password, { delay: 50 });
    return this;
  }

  clickLogin() {
    cy.get(this.selectors.loginButton).click();
  }

  login(username, password) {
    this.enterUsername(username);
    this.enterPassword(password);
    this.clickLogin();
    return this;
  }

  // Assertions
  verifyLoginPageDisplayed() {
    cy.get(this.selectors.container).should('be.visible');
    cy.get(this.selectors.loginButton).should('contain', 'LOGIN');
    return this;
  }

  verifyErrorMessage(expectedMessage) {
    cy.get(this.selectors.errorMessage).should('contain', expectedMessage);
    return this;
  }

  verifyErrorMessageNotVisible() {
    cy.get(this.selectors.errorMessage).should('not.exist');
    return this;
  }

  verifyLoginSuccess() {
    cy.url().should('include', '/inventory.html');
    return this;
  }
}

export default new LoginPage();
