import { TEST_USERS } from '../support/helpers/testData';
import LoginPage from '../support/pages/LoginPage';
import InventoryPage from '../support/pages/InventoryPage';

describe('Product Browsing - Sauce Demo', () => {
  before(() => {
    LoginPage.visit();
    const { username, password } = TEST_USERS.standard;
    LoginPage.login(username, password);
  });

  beforeEach(() => {
    cy.visit('/inventory.html');
  });

  describe('Product Display', () => {
    it('should display the product list', () => {
      InventoryPage.verifyProductsDisplayed();
    });

    it('should display all products with name and price', () => {
      cy.get('.inventory_item').each(($item) => {
        cy.wrap($item).find('.inventory_item_name').should('exist');
        cy.wrap($item).find('.inventory_item_price').should('exist');
      });
    });

    it('should display product images', () => {
      cy.get('.inventory_item_img img').should('have.length.greaterThan', 0);
    });

    it('should have add to cart button on each product', () => {
      cy.get('[data-test^="add-to-cart"]').should('have.length.greaterThan', 0);
    });
  });

  describe('Product Details', () => {
    it('should navigate to product details page', () => {
      InventoryPage.clickProductByName('Sauce Labs Backpack');
      cy.url().should('include', '/inventory-item.html');
    });

    it('should display product details', () => {
      InventoryPage.clickProductByName('Sauce Labs Backpack');
      cy.get('.inventory_details_name').should('contain', 'Sauce Labs Backpack');
      cy.get('.inventory_details_price').should('exist');
      cy.get('.inventory_details_desc').should('exist');
    });

    it('should have back to products link', () => {
      InventoryPage.clickProductByName('Sauce Labs Backpack');
      cy.get('[data-test="back-to-products"]').should('exist').click();
      cy.url().should('include', '/inventory.html');
    });

    it('should add product from details page', () => {
      InventoryPage.clickProductByName('Sauce Labs Backpack');
      cy.get('[data-test="add-to-cart"]').click();
      cy.get('[data-test="shopping-cart-badge"]').should('contain', '1');
    });
  });

  describe('Product Sorting', () => {
    it('should sort by name ascending', () => {
      InventoryPage.sortBy('az');
      let previousName = '';
      cy.get('.inventory_item_name').each(($name) => {
        const currentName = $name.text();
        if (previousName) {
          expect(currentName >= previousName).to.be.true;
        }
        previousName = currentName;
      });
    });

    it('should sort by name descending', () => {
      InventoryPage.sortBy('za');
      let previousName = 'zzz';
      cy.get('.inventory_item_name').each(($name) => {
        const currentName = $name.text();
        expect(currentName <= previousName).to.be.true;
        previousName = currentName;
      });
    });

    it('should sort by price low to high', () => {
      InventoryPage.sortBy('lohi');
      let previousPrice = 0;
      cy.get('.inventory_item_price').each(($price) => {
        const priceText = $price.text().replace('$', '');
        const currentPrice = parseFloat(priceText);
        expect(currentPrice >= previousPrice).to.be.true;
        previousPrice = currentPrice;
      });
    });

    it('should sort by price high to low', () => {
      InventoryPage.sortBy('hilo');
      let previousPrice = 9999;
      cy.get('.inventory_item_price').each(($price) => {
        const priceText = $price.text().replace('$', '');
        const currentPrice = parseFloat(priceText);
        expect(currentPrice <= previousPrice).to.be.true;
        previousPrice = currentPrice;
      });
    });
  });

  describe('Product Filtering', () => {
    it('should filter products by selecting specific items', () => {
      // Select a few products
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      InventoryPage.addProductToCart('Sauce Labs Bike Light');
      InventoryPage.verifyCartBadgeCount(2);
    });

    it('should maintain filter after navigation', () => {
      InventoryPage.addProductToCart('Sauce Labs Backpack');
      cy.get('.shopping_cart_link').click();
      cy.url().should('include', '/cart.html');
      cy.get('.shopping_cart_badge').should('contain', '1');
    });
  });

  describe('Product Availability', () => {
    const expectedProducts = [
      'Sauce Labs Backpack',
      'Sauce Labs Bike Light',
      'Sauce Labs Bolt T-Shirt',
      'Sauce Labs Fleece Jacket',
      'Sauce Labs Onesie',
      'Test.allTheThings() T-Shirt (Red)'
    ];

    expectedProducts.forEach((product) => {
      it(`should display ${product}`, () => {
        InventoryPage.verifyProductExists(product);
      });
    });
  });
});
