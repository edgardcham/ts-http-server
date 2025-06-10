import { Request, Response } from 'express';
import { createUser, updateUser } from '../db/queries/users.js';
import { BadRequestError } from './errors.js';
import { hashPassword, validateJWT, getBearerToken } from './auth.js';
import { type NewUser } from '../db/schema.js';
import { config } from '../config.js';

export async function handlerAddUser(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new BadRequestError('Email and password are required');
        }

        const hashedPassword = await hashPassword(password);
        const user = await createUser({ email, hashedPassword });

        if (!user) {
            throw new BadRequestError('Email already exists');
        }

        const userResponse: UserResponse = {
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
            isChirpyRed: user.isChirpyRed,
        };

        res.status(201).json(userResponse);
    } catch (error) {
        console.error('Error in handlerAddUser:', error);
        throw error;
    }
}

export async function handlerUpdateUser(req: Request, res: Response) {
    const token = getBearerToken(req);
    const userId = validateJWT(token, config.api.jwtSecret);
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Email and password are required');
    }
    const hashedPassword = await hashPassword(password);
    const user = await updateUser(userId, { email, hashedPassword });
    if (!user) {
        throw new BadRequestError('User not found');
    }
    const userResponse: UserResponse = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        isChirpyRed: user.isChirpyRed,
    };
    res.status(200).json(userResponse);
}

type UserResponse = Omit<NewUser, 'hashedPassword'>;
