module.exports = {
    testEnvironment: 'jsdom',
    testMatch: ['<rootDir>/tests/unit/**/*.test.cjs', '<rootDir>/tests/unit/**/*.test.jsx'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup.cjs'],
    transform: {'^.+\\.[cm]?[jt]sx?$': ['babel-jest', {presets: [['@babel/preset-env', {targets: {node: 'current'}}], '@babel/preset-react']}]},
    moduleNameMapper: {'\\.(jpg|png|webp)$': '<rootDir>/tests/fileMock.cjs', '\\.css$': '<rootDir>/tests/styleMock.cjs'},
    collectCoverageFrom: ['src/**/*.{js,jsx,cjs}'],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'json', 'html', 'json-summary'],
    coverageThreshold: {global: {statements: 100, branches: 100, functions: 100, lines: 100}},
    clearMocks: true
};
