module.exports = {
  extends: ['@react-native', '../../.eslintrc.js'],
  overrides: [
    {
      files: './index.js',
      parser: '@babel/eslint-parser',
    },
  ],
};
