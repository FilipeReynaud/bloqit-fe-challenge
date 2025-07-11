export default {
  displayName: '@bloqit-fe-challenge/pokedex',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: 'test-output/jest/coverage',
  moduleNameMapper: {
    '^@/lib(.*)$': '<rootDir>/src/lib/$1',
    '^@/components(.*)$': '<rootDir>/src/components/$1',
    '^@/services(.*)$': '<rootDir>/src/services/$1',
    '^@/hooks(.*)$': '<rootDir>/src/hooks/$1',
  },
};
