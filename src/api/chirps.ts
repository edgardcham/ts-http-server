import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from './errors.js';
import {
    createChirp,
    getAllChirps,
    getChirpById,
} from '../db/queries/chirps.js';

export async function handlerCreateChirp(
    req: Request,
    res: Response,
): Promise<void> {
    const { body, userId } = req.body;
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
            user_id: userId,
        });

        // Transform the response to match the expected API format
        const response = {
            id: chirp.id,
            createdAt: chirp.createdAt,
            updatedAt: chirp.updatedAt,
            body: chirp.body,
            userId: chirp.user_id, // needed for test
        };

        res.header('Content-Type', 'application/json');

        res.status(201).send(JSON.stringify(response));
    }
}

export async function handlerGetAllChirps(req: Request, res: Response) {
    const chirps = await getAllChirps();
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
