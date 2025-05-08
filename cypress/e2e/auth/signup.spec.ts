describe('Rejestracja użytkownika', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('powinno wyświetlić formularz rejestracji', () => {
    cy.getByTestId('signup-email').should('be.visible');
    cy.getByTestId('signup-password').should('be.visible');
    cy.getByTestId('signup-password-confirm').should('be.visible');
    cy.getByTestId('signup-button').should('be.visible');
  });

  it('powinno pokazać błąd walidacji gdy hasła nie pasują', () => {
    cy.getByTestId('signup-email').type('nowy@example.com');
    cy.getByTestId('signup-password').type('haslo123');
    cy.getByTestId('signup-password-confirm').type('inne_haslo');
    cy.getByTestId('signup-button').click();

    // Sprawdzamy czy pojawił się komunikat o błędzie
    cy.contains('Hasła nie są identyczne').should('be.visible');
  });

  it('powinno zarejestrować nowego użytkownika', () => {
    // Mockowanie udanej rejestracji
    cy.intercept('POST', '/api/auth/signup', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Sprawdź skrzynkę pocztową w celu potwierdzenia konta'
      }
    }).as('signupRequest');

    cy.getByTestId('signup-email').type('nowy@example.com');
    cy.getByTestId('signup-password').type('haslo123');
    cy.getByTestId('signup-password-confirm').type('haslo123');
    cy.getByTestId('signup-button').click();

    cy.wait('@signupRequest');

    // Sprawdzenie komunikatu po udanej rejestracji
    cy.contains('Sprawdź skrzynkę pocztową w celu potwierdzenia konta').should('be.visible');
  });
});
