import express from 'express';
import { config } from './config.js';
import {
    middlewareLogResponses,
    middlewareMetricsInc,
} from './api/middlewares.js';
import { handlerReadiness } from './api/readiness.js';
import {
    handlerCreateChirp,
    handlerGetAllChirps,
    handlerGetChirpById,
    handlerDeleteChirp,
} from './api/chirps.js';
import { handlerMetrics, handlerResetMetrics } from './api/metrics.js';
import { errorHandler } from './api/errorHandler.js';
import { handlerAddUser, handlerUpdateUser } from './api/users.js';
import { deleteAllUsers } from './db/queries/admin.js';

import postgres from 'postgres';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import { ForbiddenError } from './api/errors.js';
import { handlerLogin, handlerRefresh, handlerRevoke } from './api/auth.js';

// Run database migrations automatically on startup
const migrationClient = postgres(config.db.url, { max: 1 });
try {
    await migrate(drizzle(migrationClient), config.db.migrationConfig);
    console.log('✅ Database migrations completed');
} catch (error) {
    console.error('❌ Database migration failed:', error);
    process.exit(1);
} finally {
    await migrationClient.end();
}

const app = express();
app.use(express.json());
app.use('/app', middlewareMetricsInc, express.static('./src/app'));

app.use(middlewareLogResponses);

app.get('/api/healthz', async (req, res, next) => {
    try {
        await handlerReadiness(req, res);
    } catch (error) {
        next(error);
    }
});

app.get('/admin/metrics', async (req, res, next) => {
    try {
        await handlerMetrics(req, res);
    } catch (error) {
        next(error);
    }
});
app.post('/admin/reset', async (req, res, next) => {
    try {
        await handlerResetMetrics(req, res);
    } catch (error) {
        next(error);
    }
});

app.post('/api/users', async (req, res, next) => {
    try {
        await handlerAddUser(req, res);
    } catch (error) {
        next(error);
    }
});

app.put('/api/users', async (req, res, next) => {
    try {
        await handlerUpdateUser(req, res);
    } catch (error) {
        next(error);
    }
});

app.post('/api/login', async (req, res, next) => {
    try {
        await handlerLogin(req, res);
    } catch (error) {
        next(error);
    }
});

app.post('/api/refresh', async (req, res, next) => {
    try {
        await handlerRefresh(req, res);
    } catch (error) {
        next(error);
    }
});

app.post('/api/revoke', async (req, res, next) => {
    try {
        await handlerRevoke(req, res);
    } catch (error) {
        next(error);
    }
});

app.post('/api/chirps', async (req, res, next) => {
    try {
        await handlerCreateChirp(req, res);
    } catch (error) {
        next(error);
    }
});

app.get('/api/chirps', async (req, res, next) => {
    try {
        await handlerGetAllChirps(req, res);
    } catch (error) {
        next(error);
    }
});

app.get('/api/chirps/:chirpId', async (req, res, next) => {
    try {
        await handlerGetChirpById(req, res);
    } catch (error) {
        next(error);
    }
});

app.delete('/api/chirps/:chirpId', async (req, res, next) => {
    try {
        await handlerDeleteChirp(req, res);
    } catch (error) {
        next(error);
    }
});

// Error handler must be last
app.use(errorHandler);
app.listen(config.api.port, () => {
    console.log(`Server is running on port ${config.api.port}`);
});
