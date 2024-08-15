module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
      '^.+\\.(ts|tsx)?$': 'ts-jest',
      '^.+\\.jsx?$': 'babel-jest', // Это нужно для преобразования JavaScript файлов
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transformIgnorePatterns: [
      "node_modules/(?!(your-module-name|another-module-to-transform)/)"
    ],
  };
  