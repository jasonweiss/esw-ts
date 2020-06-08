module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/test', '<rootDir>/integration'],
  preset: 'ts-jest',
  testRegex: [
    '(/test/.*|(\\.|/)(test|spec))\\.ts?$',
    '(/integration/.*|(\\.|/)(test|spec))\\.ts?$',
    '(/test/.*|(\\.|/)(test|spec))\\.tsx?$'
  ],
  testPathIgnorePatterns: ['test/utils/MockHelpers.ts', 'integration/utils/*'],
  moduleDirectories: ['node_modules', 'src', 'test', 'integration'],
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  coveragePathIgnorePatterns: ['/node_modules/', 'test/utils/MockHelpers.ts', '/integration/']
}
