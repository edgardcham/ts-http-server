import { Request, Response } from 'express';
import { BadRequestError } from './errors.js';

export async function handlerValidateChirp(
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
