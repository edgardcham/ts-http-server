import { config } from '../config.js';
import { Request, Response } from 'express';

export async function handlerMetrics(
    req: Request,
    res: Response,
): Promise<void> {
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.send(`<html>
                <body>
                    <h1>Welcome, Chirpy Admin</h1>
                    <p>Chirpy has been visited ${config.api.fileServerHits} times!</p>
                </body>
                </html>`);
}

export async function handlerResetMetrics(
    req: Request,
    res: Response,
): Promise<void> {
    config.api.fileServerHits = 0;
    res.set('Content-Type', 'text/plain; charset=utf-8');
    res.send('OK');
}
