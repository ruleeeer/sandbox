module.exports = {
  preset: 'ts-jest',
  testMatch: ['<rootDir>/src/__test__/**/*spec.[jt]s?(x)'],
  rootDir: __dirname,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  clearMocks: true,
  coverageDirectory: "coverage",
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      noUnusedLocals: true,
      strictNullChecks: true,
      noUnusedParameters: true,
      experimentalDecorators: true,
      allowSyntheticDefaultImports: true,
    }
  }
}
