import { TEST_USERS } from '../support/helpers/testData';
import LoginPage from '../support/pages/LoginPage';
import InventoryPage from '../support/pages/InventoryPage';
import CartPage from '../support/pages/CartPage';

describe('Shopping Cart - Sauce Demo', () => {
  before(() => {
    LoginPage.visit();
    const { username, password } = TEST_USERS.standard;
    LoginPage.login(username, password);
  });

  beforeEach(() => {
    cy.visit('/inventory.html');
  });

  describe('Adding Items to Cart', () => {
    it('should add single item to cart', () => {
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      InventoryPage.verifyCartBadgeCount(1);
    });

    it('should add multiple items to cart', () => {
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      InventoryPage.addProductToCart('Sauce Labs Bike Light');
      InventoryPage.addProductToCart('Sauce Labs Bolt T-Shirt');
      InventoryPage.verifyCartBadgeCount(3);
    });

    it('should update cart badge when adding item', () => {
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      InventoryPage.verifyCartBadgeCount(1);
      InventoryPage.addProductToCart('Sauce Labs Bike Light');
      InventoryPage.verifyCartBadgeCount(2);
    });

    it('should show all cart items in cart page', () => {
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      InventoryPage.addProductToCart('Sauce Labs Bike Light');
      InventoryPage.navigateToCart();
      CartPage.verifyCartItemCount(2);
    });
  });

  describe('Cart Display', () => {
    beforeEach(() => {
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      InventoryPage.addProductToCart('Sauce Labs Bike Light');
      InventoryPage.navigateToCart();
    });

    it('should display cart page with items', () => {
      CartPage.verifyCartDisplayed();
      CartPage.verifyCartItemCount(2);
    });

    it('should display item names in cart', () => {
      CartPage.verifyItemInCart('Sauce Labs Backpack');
      CartPage.verifyItemInCart('Sauce Labs Bike Light');
    });

    it('should display item prices in cart', () => {
      // Verify at least one item has a price
      cy.get('.cart_item_label .inventory_item_price').should('exist');
    });

    it('should display quantity for each item', () => {
      cy.get('.cart_quantity').should('exist');
    });

    it('should display continue shopping button', () => {
      cy.get('[data-test="continue-shopping"]').should('exist');
    });

    it('should display checkout button', () => {
      cy.get('[data-test="checkout"]').should('exist');
    });
  });

  describe('Removing Items from Cart', () => {
    beforeEach(() => {
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      InventoryPage.addProductToCart('Sauce Labs Bike Light');
      InventoryPage.navigateToCart();
    });

    it('should remove item from cart', () => {
      CartPage.verifyCartItemCount(2);
      CartPage.removeItemByName('Sauce Labs Backpack');
      CartPage.verifyCartItemCount(1);
    });

    it('should remove all items from cart', () => {
      CartPage.removeItemByName('Sauce Labs Backpack');
      CartPage.removeItemByName('Sauce Labs Bike Light');
      CartPage.verifyCartEmpty();
    });

    it('should update cart badge when removing item', () => {
      cy.visit('/inventory.html');
      InventoryPage.verifyCartBadgeCount(2);
      cy.visit('/cart.html');
      CartPage.removeItemByName('Sauce Labs Backpack');
      cy.visit('/inventory.html');
      InventoryPage.verifyCartBadgeCount(1);
    });

    it('should verify item is not in cart after removal', () => {
      CartPage.removeItemByName('Sauce Labs Backpack');
      CartPage.verifyItemNotInCart('Sauce Labs Backpack');
    });
  });

  describe('Cart Persistence', () => {
    it('should persist items after page reload', () => {
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      InventoryPage.addProductToCart('Sauce Labs Bike Light');
      InventoryPage.verifyCartBadgeCount(2);
      
      cy.reload();
      
      InventoryPage.verifyCartBadgeCount(2);
      InventoryPage.navigateToCart();
      CartPage.verifyCartItemCount(2);
    });

    it('should persist items when navigating between pages', () => {
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      InventoryPage.navigateToCart();
      CartPage.verifyItemInCart('Sauce Labs Backpack');
      
      CartPage.clickContinueShopping();
      InventoryPage.verifyCartBadgeCount(1);
    });
  });

  describe('Cart Navigation', () => {
    it('should navigate to checkout from cart', () => {
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      InventoryPage.navigateToCart();
      CartPage.clickCheckout();
      cy.url().should('include', '/checkout-step-one.html');
    });

    it('should navigate back to shopping from cart', () => {
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      InventoryPage.navigateToCart();
      CartPage.clickContinueShopping();
      cy.url().should('include', '/inventory.html');
    });
  });

  describe('Empty Cart', () => {
    it('should handle empty cart', () => {
      CartPage.visit();
      CartPage.verifyCartEmpty();
    });
  });
});
