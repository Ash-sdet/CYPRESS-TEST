export class InventoryPage {
  // Selectors
  selectors = {
    productList: '.inventory_list',
    productItem: '.inventory_item',
    productName: '.inventory_item_name',
    productPrice: '.inventory_item_price',
    addToCartButton: 'button[data-test^="add-to-cart"]',
    removeButton: 'button[data-test^="remove"]',
    sortDropdown: '.product_sort_container select',
    cartIcon: '.shopping_cart_link',
    cartBadge: '.shopping_cart_badge',
    menuButton: '[data-test="bm-menu-button"]',
    logoutLink: '[data-test="logout-sidebar-link"]'
  };

  // Navigation
  visit() {
    cy.visit('/inventory.html');
  }

  navigateToCart() {
    cy.get(this.selectors.cartIcon).click();
    cy.url().should('include', '/cart.html');
  }

  // Product interactions
  clickProductByName(productName) {
    cy.contains(this.selectors.productName, productName).click();
    cy.url().should('include', '/inventory-item.html');
  }

  addProductToCart(productName) {
    cy.contains(this.selectors.productItem, productName)
      .find(this.selectors.addToCartButton)
      .click();
  }

  removeProductFromCart(productName) {
    cy.contains(this.selectors.productItem, productName)
      .find(this.selectors.removeButton)
      .click();
  }

  sortBy(option) {
    cy.get(this.selectors.sortDropdown).select(option);
  }

  // Assertions
  verifyProductsDisplayed() {
    cy.get(this.selectors.productList).should('be.visible');
    cy.get(this.selectors.productItem).should('have.length.greaterThan', 0);
    return this;
  }

  verifyProductExists(productName) {
    cy.contains(this.selectors.productName, productName).should('exist');
    return this;
  }

  verifyCartBadgeCount(count) {
    cy.get(this.selectors.cartBadge).should('contain', count);
    return this;
  }

  verifyProductPrice(productName, price) {
    cy.contains(this.selectors.productItem, productName)
      .find(this.selectors.productPrice)
      .should('contain', price);
    return this;
  }

  logout() {
    cy.get(this.selectors.menuButton).click();
    cy.get(this.selectors.logoutLink, { timeout: 5000 }).click();
    cy.url().should('include', '/index.html');
  }
}

export default new InventoryPage();
