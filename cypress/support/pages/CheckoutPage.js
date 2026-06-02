export class CheckoutPage {
  // Step 1 - Information
  step1Selectors = {
    container: '.checkout_info',
    firstNameInput: '[data-test="firstName"]',
    lastNameInput: '[data-test="lastName"]',
    postalCodeInput: '[data-test="postalCode"]',
    continueButton: '[data-test="continue"]',
    cancelButton: '[data-test="cancel"]',
    errorMessage: '[data-test="error"]'
  };

  // Step 2 - Overview
  step2Selectors = {
    container: '.checkout_summary_container',
    finishButton: '[data-test="finish"]',
    cancelButton: '[data-test="cancel"]',
    cartItems: '.cart_item'
  };

  // Confirmation
  confirmationSelectors = {
    container: '.checkout_complete_container',
    completeHeader: '.complete-header',
    completeText: '.complete-text',
    backHomeButton: '[data-test="back-to-products"]'
  };

  // Step 1 methods
  visitCheckoutStep1() {
    cy.visit('/checkout-step-one.html');
  }

  fillCheckoutInfoStep1(firstName, lastName, postalCode) {
    cy.get(this.step1Selectors.firstNameInput).type(firstName);
    cy.get(this.step1Selectors.lastNameInput).type(lastName);
    cy.get(this.step1Selectors.postalCodeInput).type(postalCode);
    return this;
  }

  clickContinueStep1() {
    cy.get(this.step1Selectors.continueButton).click();
    cy.url().should('include', '/checkout-step-two.html');
  }

  clickCancelStep1() {
    cy.get(this.step1Selectors.cancelButton).click();
    cy.url().should('include', '/cart.html');
  }

  // Step 1 assertions
  verifyStep1Displayed() {
    cy.get(this.step1Selectors.container).should('be.visible');
    return this;
  }

  verifyErrorMessageStep1(message) {
    cy.get(this.step1Selectors.errorMessage).should('contain', message);
    return this;
  }

  // Step 2 methods
  visitCheckoutStep2() {
    cy.visit('/checkout-step-two.html');
  }

  clickFinish() {
    cy.get(this.step2Selectors.finishButton).click();
    cy.url().should('include', '/checkout-complete.html');
  }

  clickCancelStep2() {
    cy.get(this.step2Selectors.cancelButton).click();
    cy.url().should('include', '/cart.html');
  }

  // Step 2 assertions
  verifyStep2Displayed() {
    cy.get(this.step2Selectors.container).should('be.visible');
    return this;
  }

  verifyOrderTotal(total) {
    cy.contains('Total:', total).should('exist');
    return this;
  }

  // Confirmation methods & assertions
  verifyOrderComplete() {
    cy.get(this.confirmationSelectors.container).should('be.visible');
    cy.get(this.confirmationSelectors.completeHeader).should('contain', 'Thank you');
    return this;
  }

  clickBackHome() {
    cy.get(this.confirmationSelectors.backHomeButton).click();
    cy.url().should('include', '/inventory.html');
  }
}

export default new CheckoutPage();
