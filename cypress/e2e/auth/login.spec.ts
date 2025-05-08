describe('Logowanie użytkownika', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('powinno wyświetlić formularz logowania', () => {
    cy.getByTestId('login-email').should('be.visible');
    cy.getByTestId('login-password').should('be.visible');
    cy.getByTestId('login-button').should('be.visible');
  });

  it('powinno pokazać błąd przy niepoprawnych danych', () => {
    cy.getByTestId('login-email').type('nieistniejacy@example.com');
    cy.getByTestId('login-password').type('blednehaslo');
    cy.getByTestId('login-button').click();

    // Przechwytywanie żądań sieciowych
    cy.intercept('POST', '/api/auth/login').as('loginRequest');
    cy.wait('@loginRequest');

    // Sprawdzenie komunikatu o błędzie
    cy.contains('Niepoprawny email lub hasło').should('be.visible');
  });

  it('powinno zalogować użytkownika z poprawnymi danymi', () => {
    // Mockowanie udanego logowania
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: { id: '1', email: 'test@example.com' }
      }
    }).as('successLogin');

    cy.getByTestId('login-email').type('test@example.com');
    cy.getByTestId('login-password').type('poprawnehaslo');
    cy.getByTestId('login-button').click();

    cy.wait('@successLogin');

    // Sprawdzenie przekierowania po udanym logowaniu
    cy.url().should('include', '/dashboard');
  });
});
