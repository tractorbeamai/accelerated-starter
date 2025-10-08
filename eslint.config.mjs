import path from "node:path";
import { fileURLToPath } from "node:url";

import { FlatCompat } from "@eslint/eslintrc";
import pluginRouter from "@tanstack/eslint-plugin-router";
import configPrettier from "eslint-config-prettier";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginTailwind from "eslint-plugin-tailwindcss";
import pluginUnicorn from "eslint-plugin-unicorn";
import pluginZodX from "eslint-plugin-zod-x";
import tseslint from "typescript-eslint";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    // Disable type-checked rules for JS/MJS config files
    files: ["**/*.js", "**/*.mjs", "**/*.cjs"],
    ...tseslint.configs.disableTypeChecked,
  },
  pluginZodX.configs.recommended,
  ...compat.extends("plugin:drizzle/recommended"),
  ...pluginRouter.configs["flat/recommended"],
  ...pluginTailwind.configs["flat/recommended"],
  pluginUnicorn.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  ...pluginReactHooks.configs["flat/recommended"],
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
      tailwindcss: {
        config: path.resolve(__dirname, "./src/styles.css"),
      },
    },
    rules: {
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "after-used",
          ignoreRestSiblings: false,
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^(_|ignore)",
        },
      ],

      // Allow TanStack Router's Redirect to be thrown
      "@typescript-eslint/only-throw-error": [
        "error",
        {
          allow: [
            {
              from: "package",
              package: "@tanstack/router-core",
              name: "Redirect",
            },
          ],
        },
      ],

      // Disallow array index keys in React
      "react/no-array-index-key": "error",

      // Don't complain about apostrophes in markup
      "react/no-unescaped-entities": "off",

      // Disallow template literals in className, prefer cn() utility from @/lib/utils
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "JSXAttribute[name.name='className'][value.type='JSXExpressionContainer'] TemplateLiteral",
          message:
            "Use cn() utility from @/lib/utils instead of template literals in className. This ensures proper class name merging with Tailwind.",
        },
      ],

      // Disable classnames-order rule to avoid conflict with prettier-plugin-tailwindcss
      "tailwindcss/classnames-order": "off",

      // Disable annoying unicorn rules
      "unicorn/prefer-global-this": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/no-null": "off",
      "unicorn/no-nested-ternary": "off",
      "unicorn/no-array-sort": "off",
      "unicorn/no-array-reverse": "off",
      "unicorn/no-zero-fractions": "off",
      "unicorn/filename-case": "off", // Allow PascalCase for React components
      "unicorn/no-array-callback-reference": "off",
      "unicorn/prefer-add-event-listener": "off",
      "unicorn/consistent-function-scoping": "off",
      "unicorn/text-encoding-identifier-case": "off",
      "unicorn/prefer-switch": "off",

      // Disable annoying typescript-eslint rules for demo project
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-floating-promises": "off", // Demo code, not production
      "@typescript-eslint/no-confusing-void-expression": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/prefer-function-type": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
    },
  },
  // Relax rules for CLI scripts (seed, migrate, etc.)
  {
    files: ["src/db/seed.ts", "src/db/migrate.ts", "**/*.cli.ts"],
    rules: {
      "unicorn/no-process-exit": "off",
      "unicorn/prefer-top-level-await": "off",
      "@typescript-eslint/use-unknown-in-catch-callback-variable": "off",
    },
  },
  {
    // keep synced with .prettierignore (and to a lesser extend, .gitignore)
    ignores: [
      // dependencies
      "node_modules/",
      "pnpm-lock.yaml",

      // shadcn/ui + registry components
      "src/components/ui/",
      "src/components/ai-elements/",

      // auto-generated files
      "src/routeTree.gen.ts",

      // build output
      ".vinxi/",
      ".output/",
      "dist/",
    ],
  },
  configPrettier,
];

export default eslintConfig;
