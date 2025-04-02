module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      diagnostics: false
    }]
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  
  // Mock non-JS/TS modules
  moduleNameMapper: {
    "\\.scss$": "<rootDir>/__mocks__/styleMock.js",
    "\\.css$": "<rootDir>/__mocks__/styleMock.js",
    "^src/defaults\\.js$": "<rootDir>/__mocks__/defaultsMock.js"
  }
};