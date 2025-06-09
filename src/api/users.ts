import { Request, Response } from 'express';
import { createUser } from '../db/queries/users.js';
import { BadRequestError } from './errors.js';

export async function handlerAddUser(
    req: Request,
    res: Response,
): Promise<void> {
    const { email } = req.body;
    if (!email) {
        throw new BadRequestError('Email is required');
    }
    const user = await createUser({ email });
    res.status(201).json(user);
}
