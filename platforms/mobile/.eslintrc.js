module.exports = {
  extends: ['@react-native', '../../.eslintrc'],
  overrides: [
    {
      files: './index.js',
      parser: '@babel/eslint-parser',
    },
  ],
};
