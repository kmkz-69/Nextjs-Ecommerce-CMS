import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/servers/db/schema",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
});