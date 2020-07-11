module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    // 'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-console': 0,
    'spaced-comment': 0,
    'import/first': 0,
    //可以throw字符串
    'no-throw-literal': 0,
    'no-multiple-empty-lines': 0,
    'lines-between-class-members': 0,
    //reject可以不传递错误
    'prefer-promise-reject-errors': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-inferrable-types': 0
  },
  globals: {
    wx: true,
    qq: true,
    uni: true,
    UniApp: true,
    plus: true,
    $util: true,
    $pageUtil: true
  }
}
