import { db } from '../index.js';
import { refreshTokens, type NewRefreshToken } from '../schema.js';
import { eq } from 'drizzle-orm';

export async function createRefreshToken(token: string, userId: string) {
    const newToken: NewRefreshToken = {
        token,
        user_id: userId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
        revokedAt: null,
    };
    await db.insert(refreshTokens).values(newToken);
}

export async function getRefreshToken(userId: string) {
    const [result] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.user_id, userId));
    return result;
}

export async function getUserFromRefreshToken(token: string) {
    const [result] = await db
        .select()
        .from(refreshTokens)
        .where(eq(refreshTokens.token, token));
    return result;
}

export async function revokeRefreshToken(token: string) {
    const now = new Date();
    await db
        .update(refreshTokens)
        .set({
            revokedAt: now,
        })
        .where(eq(refreshTokens.token, token));
}
