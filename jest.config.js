module.exports = {
    moduleFileExtensions: ['js', 'ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
    preset: 'ts-jest',
    testEnvironment: 'node',
}
