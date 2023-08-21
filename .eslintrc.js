module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        ts: "never",
      },
    ],
    "import/prefer-default-export": "off",
    "class-methods-use-this": 0,
    camelcase: 0,
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "no-param-reassign": ["error", { props: false }],
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],
    "import/no-extraneous-dependencies": [
      "error",
      { devDependencies: ["**/*.test.ts"] },
    ],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".ts"],
        moduleDirectory: ["node_modules", "src/"],
      },
    },
  },
};
