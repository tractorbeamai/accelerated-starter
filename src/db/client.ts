import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "@/db/schema";
import { env } from "@/lib/env-server";

export const db = drizzle(env.DATABASE_URL, { schema });
