module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard-with-typescript',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    tsconfigRootDir: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/prefer-nullish-coalescing': 0,
    '@typescript-eslint/strict-boolean-expressions': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/semi': [2, 'always'],
    '@typescript-eslint/explicit-function-return-type': 1,
    '@typescript-eslint/no-non-null-assertion': 1,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/prefer-optional-chain': 1,
    '@typescript-eslint/no-implied-eval': 1,
    '@typescript-eslint/ban-types': 1,
    '@typescript-eslint/naming-convention': 1,
    'no-new-func': 1,
    semi: [2, 'always'],
    indent: [2, 2],
    'no-useless-escape': 1,
    'no-empty': 1,
    'no-eval': 1,
    eqeqeq: 1,
    quotes: [2, 'single'],
    'multiline-ternary': 1
  }
};
