const path = require("path");
const projectFilesPaths = [
  path.resolve(__dirname, "tsconfig.json"),
  path.resolve(__dirname, "tsconfig.eslint.json"),
];

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    node: true,
    browser: false,
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: projectFilesPaths,
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
        "prettier",
      ],
      plugins: ["@typescript-eslint", "react", "prettier"],
      settings: {
        react: {
          version: "detect",
        },
      },
    },
    {
      files: [".eslintrc.js"],
      plugins: ["prettier"],
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: "commonjs",
      },
    },
  ],
};
