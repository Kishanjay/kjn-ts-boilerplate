module.exports = {
  env: {
    // TODO- adapt to your environment
    // browser: true,
    // node: true,
    es2022: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["*.js"], // These files generally are NodeJS files and should be formatted differently
};
