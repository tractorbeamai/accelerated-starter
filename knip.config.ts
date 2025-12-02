import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/router.tsx", "src/routes/**/*.{ts,tsx}", "src/db/seed.ts"],
  project: ["src/**/*.{ts,tsx}"],
  ignore: [
    "src/routeTree.gen.ts",
    "src/components/ui/**",
    "src/components/ai-elements/**",
    "src/lib/env-*.ts",
  ],
  ignoreDependencies: [
    // Peer/internal deps not directly imported
    "@tanstack/router-plugin",
    "tailwindcss-animate",
    // CLI tools used in scripts
    "neonctl",
    "vercel",
    "shadcn",
  ],
};

export default config;
