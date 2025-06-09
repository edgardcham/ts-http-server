import { describe, it, expect, beforeAll } from 'vitest';
import { hashPassword, makeJWT, validateJWT, verifyPassword } from './auth';

describe('Password Hashing', () => {
    const password1 = 'correctPassword123!';
    const password2 = 'anotherPassword456!';
    let hash1: string;
    let hash2: string;

    beforeAll(async () => {
        hash1 = await hashPassword(password1);
        hash2 = await hashPassword(password2);
    });

    it('should return true for the correct password', async () => {
        const result = await verifyPassword(password1, hash1);
        expect(result).toBe(true);
    });

    it('should return false for the incorrect password', async () => {
        const result = await verifyPassword(password2, hash1);
        expect(result).toBe(false);
    });
});

describe('JWT Token Generation', () => {
    const userId = '123';
    const secret = 'testSecret';
    const expiresIn = 3600;

    it('should return a valid JWT token', () => {
        const token = makeJWT(userId, expiresIn, secret);
        expect(token).toBeDefined();
    });
});

describe('JWT Token Validation', () => {
    const userId = '123';
    const secret = 'testSecret';
    const expiresIn = 3600;

    it('should return the user id from the token', () => {
        const token = makeJWT(userId, expiresIn, secret);
        const result = validateJWT(token, secret);
        expect(result).toBe(userId);
    });

    it('should throw an error if the token is invalid', () => {
        const token = makeJWT(userId, expiresIn, secret);
        expect(() => validateJWT(token, 'wrongSecret')).toThrow();
    });
});
