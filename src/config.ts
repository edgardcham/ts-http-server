import { loadEnvFile } from 'node:process';
import type { MigrationConfig } from 'drizzle-orm/migrator';

loadEnvFile();

// helper function to load key otherwise throw to exit early.
const envOrThrow = (key: string) => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
};

// Database configuration type
export type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
};

export type APIConfig = {
    fileServerHits: number;
    port: number;
    platform: string;
    jwtSecret: string;
};

// Main API configuration type
export type Config = {
    api: APIConfig;
    db: DBConfig;
};

// Migration configuration
const migrationConfig: MigrationConfig = {
    migrationsFolder: './src/db/migrations',
};

// Main configuration object
export const config: Config = {
    api: {
        fileServerHits: 0,
        port: Number(envOrThrow('PORT')),
        platform: envOrThrow('PLATFORM'),
        jwtSecret: envOrThrow('JWT_SECRET'),
    },
    db: {
        url: envOrThrow('DB_URL'),
        migrationConfig: migrationConfig,
    },
};
