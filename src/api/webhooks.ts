import { Request, Response } from 'express';
import { getUserById, upgradeUser } from '../db/queries/users.js';
import { NotFoundError, UnauthorizedError } from './errors.js';
import { getAPIKey } from './auth.js';
import { config } from '../config.js';

// Must be idempotent
export async function handlerPolkaWebhook(req: Request, res: Response) {
    const apiKey = getAPIKey(req);
    if (apiKey !== config.api.polkaWebhookSecret) {
        throw new UnauthorizedError('Invalid API key');
    }
    const { event, data } = req.body;
    if (event !== 'user.upgraded') {
        res.status(204).send();
        return;
    }
    const userId = data.userId;
    // Check if user exists
    const user = await getUserById(userId);
    if (!user) {
        throw new NotFoundError('User not found in database');
    }
    // Check if user is already upgraded
    if (user.isChirpyRed) {
        res.status(204).send();
        return;
    }
    // Upgrade user
    await upgradeUser(userId);

    res.status(204).send();
}
