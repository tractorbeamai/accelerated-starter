import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import oxlintConfig from "@tractorbeam/oxlint-config";
import oxfmtConfig from "@tractorbeam/oxfmt-config";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite-plus";

const lint = oxlintConfig();

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [tanstackStart(), nitro(), viteReact(), tailwindcss()],
  fmt: {
    ...oxfmtConfig,
    ignorePatterns: [...oxfmtConfig.ignorePatterns, ".output/**", ".tanstack/**"],
  },
  lint: {
    ...lint,
    ignorePatterns: ["**/*.gen.*", ".output/**", ".tanstack/**", "src/components/ui/**"],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      ...lint.rules,
      "import/no-namespace": ["error", { ignore: ["@/db/schema"] }],
      "no-console": "off",
    },
    overrides: [
      {
        files: ["src/db/seed.ts"],
        rules: {
          "no-await-in-loop": "off",
        },
      },
    ],
  },
  ssr: {
    noExternal: ["streamdown"],
  },
  nitro: {},
});
