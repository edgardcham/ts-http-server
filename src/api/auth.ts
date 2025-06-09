import bcrypt from 'bcrypt';
import { BadRequestError, NotFoundError, UnauthorizedError } from './errors.js';
import { getUserByEmail } from '../db/queries/users.js';
import { Request, Response } from 'express';
import { type NewUser } from '../db/schema.js';
import { JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

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

export function makeJWT(
    userId: string,
    expiresIn: number,
    secret: string,
): string {
    // iss is the issuer of the token.
    // sub is the subject of the token = user id
    // iat is the time the token was issued.
    // exp is the time the token expires.

    const iat = Math.floor(Date.now() / 1000); // get current time in seconds
    const exp = iat + expiresIn;
    const payload: Payload = {
        iss: 'chirpy',
        sub: userId,
        iat: iat,
        exp: exp,
    };
    const token = jwt.sign(payload, secret);
    return token;
}

export function validateJWT(tokenString: string, secret: string): string {
    try {
        const payload = jwt.verify(tokenString, secret) as JwtPayload;

        // Extract the user ID from the 'sub' field
        if (!payload.sub || typeof payload.sub !== 'string') {
            throw new UnauthorizedError('Invalid token: missing user ID');
        }

        return payload.sub; // Return the user's ID
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new UnauthorizedError('Token has expired');
        } else if (error instanceof jwt.JsonWebTokenError) {
            throw new UnauthorizedError('Invalid token');
        }
        throw error;
    }
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedError('Missing or invalid authorization header');
    }
    return authHeader.split(' ')[1];
}

export async function handlerLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    let expiresIn = req.body.expiresIn;
    if (!email || !password) {
        throw new BadRequestError('Email and password are required');
    }
    const user = await getUserByEmail(email);
    const isValid = await verifyPassword(password, user.hashedPassword);
    if (!user || !isValid) {
        throw new UnauthorizedError('Incorrect email or password');
    }
    if (!expiresIn || expiresIn > 3600 || expiresIn < 0) {
        expiresIn = 3600;
    }
    const userResponse: UserResponse = {
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        email: user.email,
        token: makeJWT(user.id, expiresIn, config.api.jwtSecret),
    };
    res.status(200).json(userResponse);
}

//A JWT payload can have any key-value pair, but I used the Pick utility function to narrow the JwtPayload type down to the keys we care about:
type Payload = Pick<JwtPayload, 'iss' | 'sub' | 'iat' | 'exp'>;
type UserResponse = Omit<NewUser, 'hashedPassword'> & { token: string };
