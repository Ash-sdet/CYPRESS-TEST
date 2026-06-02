import { TEST_USERS } from '../support/helpers/testData';
import LoginPage from '../support/pages/LoginPage';
import InventoryPage from '../support/pages/InventoryPage';
import CartPage from '../support/pages/CartPage';
import CheckoutPage from '../support/pages/CheckoutPage';

describe('Checkout Flow - Sauce Demo', () => {
  before(() => {
    LoginPage.visit();
    const { username, password } = TEST_USERS.standard;
    LoginPage.login(username, password);
  });

  describe('Checkout Step 1 - Information', () => {
    beforeEach(() => {
      cy.visit('/inventory.html');
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      InventoryPage.navigateToCart();
      CartPage.clickCheckout();
    });

    it('should display checkout step 1 page', () => {
      CheckoutPage.verifyStep1Displayed();
    });

    it('should have all required fields', () => {
      cy.get('[data-test="firstName"]').should('exist');
      cy.get('[data-test="lastName"]').should('exist');
      cy.get('[data-test="postalCode"]').should('exist');
    });

    it('should proceed to step 2 with valid information', () => {
      CheckoutPage.fillCheckoutInfoStep1('John', 'Doe', '12345');
      CheckoutPage.clickContinueStep1();
      cy.url().should('include', '/checkout-step-two.html');
    });

    it('should show error for missing first name', () => {
      CheckoutPage.fillCheckoutInfoStep1('', 'Doe', '12345');
      CheckoutPage.clickContinueStep1();
      CheckoutPage.verifyErrorMessageStep1('First Name');
    });

    it('should show error for missing last name', () => {
      CheckoutPage.fillCheckoutInfoStep1('John', '', '12345');
      CheckoutPage.clickContinueStep1();
      CheckoutPage.verifyErrorMessageStep1('Last Name');
    });

    it('should show error for missing postal code', () => {
      CheckoutPage.fillCheckoutInfoStep1('John', 'Doe', '');
      CheckoutPage.clickContinueStep1();
      CheckoutPage.verifyErrorMessageStep1('Postal');
    });

    it('should cancel checkout and return to cart', () => {
      CheckoutPage.clickCancelStep1();
      cy.url().should('include', '/cart.html');
    });

    it('should accept various postal code formats', () => {
      const postalCodes = ['12345', 'A1B2C3', '00000', 'XYZ'];
      postalCodes.forEach((postalCode) => {
        cy.visit('/checkout-step-one.html');
        CheckoutPage.fillCheckoutInfoStep1('John', 'Doe', postalCode);
        CheckoutPage.clickContinueStep1();
        cy.url().should('include', '/checkout-step-two.html');
        cy.visit('/inventory.html');
        InventoryPage.navigateToCart();
        CartPage.clickCheckout();
      });
    });
  });

  describe('Checkout Step 2 - Overview', () => {
    beforeEach(() => {
      cy.visit('/inventory.html');
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      InventoryPage.addProductToCart('Sauce Labs Bike Light');
      InventoryPage.navigateToCart();
      CartPage.clickCheckout();
      CheckoutPage.fillCheckoutInfoStep1('John', 'Doe', '12345');
      CheckoutPage.clickContinueStep1();
    });

    it('should display checkout step 2 page', () => {
      CheckoutPage.verifyStep2Displayed();
    });

    it('should display cart items in overview', () => {
      cy.get('.cart_item').should('have.length', 2);
    });

    it('should display item details', () => {
      cy.get('.inventory_item_name').should('contain', 'Sauce Labs Backpack');
      cy.get('.inventory_item_name').should('contain', 'Sauce Labs Bike Light');
    });

    it('should display subtotal and total', () => {
      cy.contains('Subtotal:').should('exist');
      cy.contains('Tax:').should('exist');
      cy.contains('Total:').should('exist');
    });

    it('should cancel checkout and return to cart', () => {
      CheckoutPage.clickCancelStep2();
      cy.url().should('include', '/cart.html');
    });

    it('should proceed to confirmation page', () => {
      CheckoutPage.clickFinish();
      cy.url().should('include', '/checkout-complete.html');
    });
  });

  describe('Order Completion', () => {
    beforeEach(() => {
      cy.visit('/inventory.html');
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      InventoryPage.navigateToCart();
      CartPage.clickCheckout();
      CheckoutPage.fillCheckoutInfoStep1('Jane', 'Smith', '54321');
      CheckoutPage.clickContinueStep1();
    });

    it('should display order completion page', () => {
      CheckoutPage.clickFinish();
      CheckoutPage.verifyOrderComplete();
    });

    it('should display thank you message', () => {
      CheckoutPage.clickFinish();
      cy.contains('Thank you').should('exist');
    });

    it('should display order dispatch message', () => {
      CheckoutPage.clickFinish();
      cy.contains('dispatched').should('exist');
    });

    it('should have back home button', () => {
      CheckoutPage.clickFinish();
      cy.get('[data-test="back-to-products"]').should('exist');
    });

    it('should return to inventory after completion', () => {
      CheckoutPage.clickFinish();
      CheckoutPage.clickBackHome();
      cy.url().should('include', '/inventory.html');
    });

    it('should clear cart after successful order', () => {
      CheckoutPage.clickFinish();
      CheckoutPage.clickBackHome();
      // Cart should be empty
      InventoryPage.navigateToCart();
      CartPage.verifyCartEmpty();
    });
  });

  describe('Complete Checkout Flow', () => {
    it('should complete full purchase flow', () => {
      cy.visit('/inventory.html');
      
      // Add items
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      InventoryPage.addProductToCart('Sauce Labs Bike Light');
      InventoryPage.verifyCartBadgeCount(2);
      
      // Go to cart
      InventoryPage.navigateToCart();
      CartPage.verifyItemInCart('Sauce Labs Backpack');
      CartPage.verifyItemInCart('Sauce Labs Bike Light');
      
      // Checkout
      CartPage.clickCheckout();
      CheckoutPage.verifyStep1Displayed();
      
      // Fill info
      CheckoutPage.fillCheckoutInfoStep1('Test', 'User', '12345');
      CheckoutPage.clickContinueStep1();
      
      // Review
      CheckoutPage.verifyStep2Displayed();
      CheckoutPage.clickFinish();
      
      // Confirm
      CheckoutPage.verifyOrderComplete();
      CheckoutPage.clickBackHome();
      
      // Cart should be empty
      cy.get('.shopping_cart_badge').should('not.exist');
    });
  });
});
