import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    "src/router.tsx",
    "src/routes/**/*.{ts,tsx}",
    "src/db/seed.ts",
    "src/components/ui/**",
    "vite.config.ts",
  ],
  project: ["src/**/*.{ts,tsx}"],
  ignore: [
    "src/routeTree.gen.ts",
    "src/components/ui/**",
    // Utility hooks and libs available for use
    "src/hooks/**",
    "src/lib/env-client.ts",
    // Example server functions (exports used as templates)
    "src/server/**",
  ],
  ignoreExportsUsedInFile: true,
  ignoreDependencies: [
    // Vite Plus loads shared tool configuration from vite.config.ts
    "@tractorbeam/oxfmt-config",
    "@tractorbeam/oxlint-config",
    // Peer/internal deps not directly imported
    "@tanstack/router-plugin",
    "tw-animate-css",
    // CLI tools used in scripts
    "neonctl",
    "vercel",
  ],
};

export default config;
