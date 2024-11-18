import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

import * as schema from "./schema";

export const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: false,
});

export const db = drizzle({
  client: pool,
  schema,
  casing: "snake_case",
});
