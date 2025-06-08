import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { config } from './config.js';
import {
    NotFoundError,
    BadRequestError,
    InternalServerError,
} from './errors.js';

const app = express();
const PORT = 8080;
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
app.post('/api/validate_chirp', async (req, res, next) => {
    try {
        await handlerValidateChirp(req, res);
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

// Error handler must be last
app.use(errorHandler);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Handlers
async function handlerReadiness(req: Request, res: Response): Promise<void> {
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send('OK');
}

async function handlerMetrics(req: Request, res: Response): Promise<void> {
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(`<html>
                <body>
                    <h1>Welcome, Chirpy Admin</h1>
                    <p>Chirpy has been visited ${config.fileServerHits} times!</p>
                </body>
                </html>`);
}

async function handlerResetMetrics(req: Request, res: Response): Promise<void> {
    config.fileServerHits = 0;
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send('OK');
}

async function handlerValidateChirp(
    req: Request,
    res: Response,
): Promise<void> {
    type responseData = {
        cleanedBody: string;
        error?: string;
    };

    const { body } = req.body;
    if (body.length > 140) {
        throw new BadRequestError('Chirp is too long. Max length is 140');
        // const errorBody: responseData = {
        //     cleanedBody: '',
        //     error: 'Chirp is too long',
        // };
        // res.status(400).send(JSON.stringify(errorBody));
    } else {
        const strArray = body.split(' ');
        const cleanedArray = strArray.map((str: string) => {
            if (
                str.toLowerCase() === 'kerfuffle' ||
                str.toLowerCase() === 'sharbert' ||
                str.toLowerCase() === 'fornax'
            ) {
                return '****';
            }
            return str;
        });
        const cleanedBody = cleanedArray.join(' ');

        res.header('Content-Type', 'application/json');
        const successBody: responseData = {
            cleanedBody: cleanedBody,
        };
        res.status(200).send(JSON.stringify(successBody));
    }
}
// Error handler

async function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    console.error(err);
    if (err instanceof NotFoundError) {
        res.status(404).json({
            error: err.message,
        });
    } else if (err instanceof BadRequestError) {
        res.status(400).json({
            error: err.message,
        });
    } else if (err instanceof InternalServerError) {
        res.status(500).json({
            error: err.message,
        });
    } else {
        res.status(500).json({
            error: 'Something went wrong on our end. Please try again later.',
        });
    }
}

// Middleware
async function middlewareLogResponses(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    res.on('finish', () => {
        const status = res.statusCode;
        if (status < 200 || status >= 300) {
            console.log(
                `[NON-OK] ${req.method} ${req.url} - Status: ${status}`,
            );
        }
    });
    next();
}

async function middlewareMetricsInc(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    config.fileServerHits++;
    next();
}

// For reference
type Handler = (req: Request, res: Response) => Promise<void>;
type Middleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => Promise<void>;
