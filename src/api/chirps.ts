import { Request, Response } from 'express';
import { BadRequestError, ForbiddenError, NotFoundError } from './errors.js';
import {
    createChirp,
    getAllChirps,
    getChirpById,
    deleteChirp,
} from '../db/queries/chirps.js';
import { getBearerToken, validateJWT } from './auth.js';
import { config } from '../config.js';

export async function handlerCreateChirp(
    req: Request,
    res: Response,
): Promise<void> {
    const { body } = req.body;
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.api.jwtSecret);

    if (body.length > 140) {
        throw new BadRequestError('Chirp is too long. Max length is 140');
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

        const chirp = await createChirp({
            body: cleanedBody,
            userId: userId,
        });

        res.header('Content-Type', 'application/json');

        res.status(201).send(JSON.stringify(chirp));
    }
}

export async function handlerGetAllChirps(req: Request, res: Response) {
    const authorId = req.query.authorId as string | undefined;
    const sort = req.query.sort as string | undefined;
    const chirps = await getAllChirps(authorId, sort);
    res.status(200).send(JSON.stringify(chirps));
}

export async function handlerGetChirpById(req: Request, res: Response) {
    const chirpId = req.params.chirpId;
    const chirp = await getChirpById(chirpId);
    if (!chirp) {
        throw new NotFoundError('Chirp not found');
    }
    res.status(200).send(JSON.stringify(chirp));
}

export async function handlerDeleteChirp(req: Request, res: Response) {
    const chirpId = req.params.chirpId;
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.api.jwtSecret);
    const chirp = await getChirpById(chirpId);
    if (!chirp) {
        throw new NotFoundError('Chirp not found');
    } else if (chirp.userId !== userId) {
        throw new ForbiddenError('You are not allowed to delete this chirp');
    }
    await deleteChirp(chirpId, userId);
    res.status(204).send();
}
