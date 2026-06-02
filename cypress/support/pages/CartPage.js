export class CartPage {
  // Selectors
  selectors = {
    cartContainer: '.cart_contents',
    cartItem: '.cart_item',
    cartItemName: '.cart_item_label .inventory_item_name',
    cartItemPrice: '.cart_item_label .inventory_item_price',
    cartItemQuantity: '.cart_quantity',
    removeButton: 'button[data-test="remove-"]',
    checkoutButton: '[data-test="checkout"]',
    continueShoppingButton: '[data-test="continue-shopping"]',
    cartList: '.cart_list'
  };

  // Navigation
  visit() {
    cy.visit('/cart.html');
  }

  clickCheckout() {
    cy.get(this.selectors.checkoutButton).click();
    cy.url().should('include', '/checkout-step-one.html');
  }

  clickContinueShopping() {
    cy.get(this.selectors.continueShoppingButton).click();
    cy.url().should('include', '/inventory.html');
  }

  // Cart operations
  removeItemByName(itemName) {
    cy.contains(this.selectors.cartItem, itemName)
      .find(this.selectors.removeButton)
      .click();
  }

  // Assertions
  verifyCartDisplayed() {
    cy.get(this.selectors.cartContainer).should('be.visible');
    return this;
  }

  verifyItemInCart(itemName) {
    cy.contains(this.selectors.cartItemName, itemName).should('exist');
    return this;
  }

  verifyItemNotInCart(itemName) {
    cy.contains(this.selectors.cartItemName, itemName).should('not.exist');
    return this;
  }

  verifyCartItemCount(count) {
    cy.get(this.selectors.cartItem).should('have.length', count);
    return this;
  }

  verifyCartEmpty() {
    cy.get(this.selectors.cartList)
      .children()
      .should('have.length', 0);
    return this;
  }

  verifyItemPrice(itemName, price) {
    cy.contains(this.selectors.cartItem, itemName)
      .find(this.selectors.cartItemPrice)
      .should('contain', price);
    return this;
  }
}

export default new CartPage();
