import { defineConfig } from 'drizzle-kit';
import { loadEnvFile } from 'node:process';

loadEnvFile();

export default defineConfig({
    schema: './src/db/schema.ts',
    dialect: 'postgresql',
    out: './src/db/migrations',
    dbCredentials: {
        url: process.env.DB_URL!,
    },
});
