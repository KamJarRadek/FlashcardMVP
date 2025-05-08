// Import komend i inne konfiguracje
import './commands';

// Wyłączenie uncaught exception reporting
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});

// Blokowanie określonych typów zapytań czy logów dla czystszych raportów
// Na przykład: blokowanie zapytań do usług analitycznych w testach
const blockedUrls = [
  // '*google-analytics.com*',
  // '*hotjar.com*',
];

Cypress.on('before:browser:launch', (browser, launchOptions) => {
  if (blockedUrls.length) {
    launchOptions.args.push('--host-rules=MAP ' + blockedUrls.join(' BLOCK,MAP ') + ' BLOCK');
  }
  return launchOptions;
});
