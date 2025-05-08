// Deklaracja typów dla customowych komend
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Loguje użytkownika przez UI
       * @example cy.loginViaUI('test@example.com', 'password123')
       */
      loginViaUI(email: string, password: string): Chainable<any>;

      /**
       * Loguje użytkownika przez API (szybsza metoda bez UI)
       * @example cy.loginViaAPI('test@example.com', 'password123')
       */
      loginViaAPI(email: string, password: string): Chainable<any>;

      /**
       * Wybiera element używając data-test atrybutu
       * @example cy.getByTestId('submit-button')
       */
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

// Implementacja komendy loginViaUI
Cypress.Commands.add('loginViaUI', (email, password) => {
  cy.visit('/login');
  cy.get('[data-test="login-email"]').type(email);
  cy.get('[data-test="login-password"]').type(password);
  cy.get('[data-test="login-button"]').click();
  // Czekamy na zakończenie logowania
  cy.url().should('not.include', '/login');
});

// Implementacja komendy loginViaAPI - szybsza alternatywa dla loginViaUI
Cypress.Commands.add('loginViaAPI', (email, password) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login', // dostosuj URL do swojego API
    body: { email, password },
  }).then((response) => {
    // Zakładamy, że API zwraca token JWT
    window.localStorage.setItem('supabase.auth.token', response.body.token);
    // Możemy również ustawić inne dane użytkownika w localStorage
  });
  // Czyszczenie cookie aby zapewnić świeży stan
  cy.clearCookies();
  cy.visit('/');
});

// Implementacja komendy getByTestId
Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-test="${testId}"]`);
});

// Można dodać więcej komend, np. do wypełniania formularzy, sprawdzania stanu UI itp.
