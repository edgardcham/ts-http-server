import { Request, Response } from 'express';
import { createUser } from '../db/queries/users.js';
import { BadRequestError } from './errors.js';
import { hashPassword } from './auth.js';
import { type NewUser } from '../db/schema.js';

export async function handlerAddUser(
    req: Request,
    res: Response,
): Promise<void> {
    try {
        const { email, password } = req.body;
        console.log('email', email);
        console.log('password', password);
        if (!email || !password) {
            throw new BadRequestError('Email and password are required');
        }

        const hashedPassword = await hashPassword(password);
        const user = await createUser({ email, hashedPassword });

        if (!user) {
            throw new BadRequestError('Email already exists');
        }

        type UserResponse = Omit<NewUser, 'hashedPassword'>; // Omits the hashedPassword field from the User type
        const userResponse: UserResponse = {
            id: user.id,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            email: user.email,
        };

        res.status(201).json(userResponse);
    } catch (error) {
        console.error('Error in handlerAddUser:', error);
        throw error;
    }
}
