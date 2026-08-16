import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["src/components/ui/**"],
  ignore: [
    "src/lib/env-client.ts",
    "src/lib/intake-questions.ts",
    "src/lib/screening-rules.ts",
    "src/server/**",
  ],
  ignoreExportsUsedInFile: true,
  ignoreDependencies: ["@tanstack/router-plugin", "neonctl", "vercel"],
};

export default config;
