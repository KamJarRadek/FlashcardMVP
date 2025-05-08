// Import komend i inne konfiguracje
import './commands';

// Konfiguracja Angular-specific
import { mount } from 'cypress/angular';

// Dodawanie komendy mount do Cypress
Cypress.Commands.add('mount', mount);

// Deklaracja typów
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Montuje komponent Angular do testowania
       */
      mount: typeof mount;
    }
  }
}
