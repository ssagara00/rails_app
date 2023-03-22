/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  /*preset: 'ts-jest',*/
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss)$': '<rootDir>/__mocks__/styleMock.js',
    'react-alert': '<rootDir>/__mocks__/react-alert.ts',
  },
  transform: {
    '^.+\\.tsx?$': '@swc/jest',
  },
}
