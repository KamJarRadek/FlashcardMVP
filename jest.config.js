module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/test-setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@assets/(.*)': '<rootDir>/src/assets/$1',
    '^@authentication/(.*)$': '<rootDir>/src/app/features/authentication/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    "^@guards/(.*)$": "<rootDir>/src/app/core/guards/$1",
  },
  testPathIgnorePatterns: ['<rootDir>/e2e/', '/node_modules/', 'src/environments/'],
};
