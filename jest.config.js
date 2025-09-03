export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '<rootDir>/client/src/**/__tests__/**/*.(ts|tsx)',
    '<rootDir>/client/src/**/*.(test|spec).(ts|tsx)',
  ],
  collectCoverageFrom: [
    'client/src/**/*.(ts|tsx)',
    '!client/src/**/*.d.ts',
    '!client/src/main.tsx',
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
};
