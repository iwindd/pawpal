import baseConfig from "@pawpal/eslint-config/base.js";

export default [
  ...baseConfig,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      // Package-specific rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "error",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];
