import { and, asc, eq } from 'drizzle-orm';
import { db } from '../index.js';
import { chirps, type NewChirp } from '../schema.js';

export async function createChirp(chirp: NewChirp) {
    const [result] = await db.insert(chirps).values(chirp).returning();
    return result;
}

export async function getAllChirps(authorId?: string) {
    const result = await db
        .select()
        .from(chirps)
        .where(authorId ? eq(chirps.userId, authorId) : undefined)
        .orderBy(asc(chirps.createdAt));
    return result;
}

export async function getChirpById(chirpId: string) {
    const [result] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, chirpId));
    return result;
}

export async function deleteChirp(chirpId: string, userId: string) {
    const result = await db
        .delete(chirps)
        .where(and(eq(chirps.id, chirpId), eq(chirps.userId, userId)));
    return result;
}

