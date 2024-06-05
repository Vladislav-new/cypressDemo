// @see error 2306 https://github.com/microsoft/TypeScript/blob/3fcd1b51a1e6b16d007b368229af03455c7d5794/src/compiler/diagnosticMessages.json#L1635
//const registerCypressGrep = require('@cypress/grep')

const { defineConfig } = require('cypress');
// @ts-ignore
const cypressSplit = require('cypress-split')

let baseUrl = "https://demoqa.com/";

module.exports = defineConfig({  
  reporter: 'mochawesome',
  reporterOptions: {
    useInlineDiffs: true,
    embeddedScreenshots: true,
    reportDir: 'cypress/results',
    reportFilename: '[name]-report.html',
    overwrite: true,
    html: true,
    // need JSON reports to merge them later
    json: true,
  },
  retries: {
    runMode: 1,
    openMode: 0,
  },
  env: {
    hideXHR: false,
    RECAPTCHA_SITE_KEY: '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
  chromeWebSecurity: false,
  e2e: {
    downloadsFolder: 'C:/Users/vladi/Downloads',
    defaultCommandTimeout: 15000,
    baseUrl,    
    chromeWebSecurity: false,
    trashAssetsBeforeRuns: true,
    experimentalInteractiveRunEvents: true,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 10,
    video: false,
    setupNodeEvents(on, config) {
      cypressSplit(on, config)
      require('@cypress/grep/src/plugin')(config);
      return config;
    },
  },
});