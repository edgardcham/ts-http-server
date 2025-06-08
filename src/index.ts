import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { config } from './config.js';

const app = express();
const PORT = 8080;
app.use(express.json());
app.use('/app', middlewareMetricsInc, express.static('./src/app'));

app.use(middlewareLogResponses);

app.get('/api/healthz', handlerReadiness);
app.post('/api/validate_chirp', handlerValidateChirp);
app.get('/admin/metrics', handlerMetrics);
app.post('/admin/reset', handlerResetMetrics);

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
    try {
        const { body } = req.body;
        if (body.length > 140) {
            const errorBody: responseData = {
                cleanedBody: '',
                error: 'Chirp is too long',
            };
            res.status(400).send(JSON.stringify(errorBody));
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
    } catch (error) {
        res.status(500).send(
            JSON.stringify({
                cleanedBody: '',
                error: 'Something went wrong',
            }),
        );
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
