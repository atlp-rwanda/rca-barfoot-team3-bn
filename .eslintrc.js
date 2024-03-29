module.exports = {
  root: true,
  extends: [
    'airbnb-base',
  ],
  env: {
    node: true,
    es6: true,
    mocha: true
  },
  rules: {
    "one-var": 0,
    'no-console': 'off',
    "no-unused-vars": "warn",
    "one-var-declaration-per-line": 0,
    "new-cap": 0,
    "consistent-return": 0,
    "no-param-reassign": 0,
    "comma-dangle": 0,
    "curly": ["error", "multi-line"],
    "import/no-unresolved": [2, { commonjs: false }],
    "no-shadow": ["error", { "allow": ["req", "res", "err"] }],
    'linebreak-style': ["error", "unix"],
    "valid-jsdoc": ["error", {
      "requireReturn": true,
      "requireReturnType": true,
      "requireParamDescription": false,
      "requireReturnDescription": true
    }],
  }
}