import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/router.tsx", "src/routes/**/*.{ts,tsx}", "src/db/seed.ts", "src/components/ui/**", "src/components/ai-elements/**", "eslint.config.mjs"],
  project: ["src/**/*.{ts,tsx}"],
  ignore: [
    "src/routeTree.gen.ts",
    "src/components/ui/**",
    "src/components/ai-elements/**",
    // Utility hooks and libs available for use
    "src/hooks/**",
    "src/lib/env-client.ts",
    // Example server functions (exports used as templates)
    "src/server/**",
  ],
  ignoreExportsUsedInFile: true,
  ignoreDependencies: [
    // Peer/internal deps not directly imported
    "@tanstack/router-plugin",
    "tw-animate-css",
    // CLI tools used in scripts
    "neonctl",
    "vercel",
  ],
};

export default config;
