import { NextFunction, Request, Response } from 'express';
import {
    InternalServerError,
    NotFoundError,
    BadRequestError,
    ForbiddenError,
    UnauthorizedError,
} from './errors.js';

export async function errorHandler(
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
    } else if (err instanceof ForbiddenError) {
        res.status(403).json({
            error: err.message,
        });
    } else if (err instanceof UnauthorizedError) {
        res.status(401).json({
            error: err.message,
        });
    } else {
        res.status(500).json({
            error: 'Something went wrong on our end. Please try again later.',
        });
    }
}
