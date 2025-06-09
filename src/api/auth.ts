import bcrypt from 'bcrypt';
import { BadRequestError, NotFoundError, UnauthorizedError } from './errors.js';
import { getUserByEmail } from '../db/queries/users.js';
import { Request, Response } from 'express';
import { type NewUser } from '../db/schema.js';

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export async function verifyPassword(
    password: string,
    hash: string,
): Promise<boolean> {
    const isValid = await bcrypt.compare(password, hash);
    return isValid;
}

export async function handlerLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError('Email and password are required');
    }
    const user = await getUserByEmail(email);
    const isValid = await verifyPassword(password, user.hashedPassword);
    if (!user || !isValid) {
        throw new UnauthorizedError('Incorrect email or password');
    }
    type userResponse = Omit<NewUser, 'hashedPassword'>;
    const userResponse: userResponse = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
    };
    res.status(200).json(userResponse);
}
