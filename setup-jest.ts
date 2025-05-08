import 'jest-preset-angular/setup-jest';
import '@testing-library/jest-dom';

// Globalne makra i ustawienia specyficzne dla projektu
global.beforeEach(() => {
  // Tutaj można dodać globalne ustawienia beforeEach dla wszystkich testów
});

// Rozszerzam interfejs expect dla własnych matcherów
declare global {
  namespace jest {
    interface Matchers<R> {
      // Tutaj można dodać własne matchery
    }
  }
}
