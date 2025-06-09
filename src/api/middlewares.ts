import { NextFunction, Request, Response } from 'express';
import { config } from '../config.js';

// Middleware
export async function middlewareLogResponses(
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

export async function middlewareMetricsInc(
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> {
    config.api.fileServerHits++;
    next();
}
