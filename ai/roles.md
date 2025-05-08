## FRONTEND

### Guidelines for ANGULAR

#### ANGULAR_CODING_STANDARDS

- Use standalone components, directives, and pipes instead of NgModules
- Implement signals for state management instead of traditional RxJS-based approaches
- Use the new inject function instead of constructor injection
- Implement control flow with @if, @for, and @switch instead of *ngIf, *ngFor, etc.
- Leverage functional guards and resolvers instead of class-based ones
- Use the new deferrable views for improved loading states
- Implement OnPush change detection strategy for improved performance
- Use TypeScript decorators with explicit visibility modifiers (public, private)
- Leverage Angular CLI for schematics and code generation
- Implement proper lazy loading with loadComponent and loadChildren


- Use theme mixins to customize component styles instead of overriding CSS
- Implement OnPush change detection for performance critical components
- Leverage the CDK (Component Development Kit) for custom component behaviors
- Use Material's form field components with reactive forms for consistent validation UX
- Implement accessibility attributes and ARIA labels for interactive components
- Use the new Material 3 design system updates where available
- Leverage the Angular Material theming system for consistent branding
- Implement proper typography hierarchy using the Material typography system
- Use Angular Material's built-in a11y features like focus indicators and keyboard navigation
- Implementację Route Guards (np. AuthGuard) wykorzystującego Supabase client do sprawdzania stanu sesji.
- Rozszerzyć AuthInterceptor o przekierowanie na /login w przypadku braku/wygaśnięcia tokena. 

## TESTING

### Guidelines for UNIT

#### JEST

- Use Jest with TypeScript for type checking in tests
- Implement Testing Library for component testing instead of enzyme
- Use snapshot testing sparingly and only for stable UI components
- Leverage mock functions and spies for isolating units of code
- Implement test setup and teardown with beforeEach and afterEach
- Use describe blocks for organizing related tests
- Leverage expect assertions with specific matchers
- Implement code coverage reporting with meaningful targets
- Use mockResolvedValue and mockRejectedValue for async testing
- Leverage fake timers for testing time-dependent functionality

### Guidelines for E2E

#### CYPRESS

- Use component testing for testing components in isolation
- Implement E2E testing for critical user flows
- Use cy.intercept() for network request mocking and stubbing
- Leverage custom commands for reusable test steps
- Implement fixtures for test data
- Use data-* attributes for test selectors instead of CSS classes or IDs
- Leverage the Testing Library integration for better queries
- Implement retry-ability for flaky tests
- Use the Cypress Dashboard for CI integration and test analytics
- Leverage visual testing for UI regression testing
