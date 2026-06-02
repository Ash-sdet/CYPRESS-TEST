const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Base URL for all test requests
    baseUrl: 'https://www.saucedemo.com',
    projectId: "64y2th",

    // Viewport size for browser window
    viewportWidth: 1280,
    viewportHeight: 720,

    // Command and request timeout configurations
    defaultCommandTimeout: 8000,
    requestTimeout: 8000,
    responseTimeout: 8000,
    supportFile: false, // Disable support file if not needed

    // Browser configurations
    chromeWebSecurity: false, // Disable Chrome web security to handle CORS issues

    // Video and screenshot settings
    video: false, // Disable video recording for faster test execution
    screenshotOnRunFailure: true, // Capture screenshot on test failure for debugging

    // Additional recommended settings for stability
    numTestsKeptInMemory: 0,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  // Component testing configuration (optional, can be used for component tests)
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
  },
});
