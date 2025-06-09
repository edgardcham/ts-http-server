import { db } from '../index.js';
import { users, refreshTokens } from '../schema.js';
import { config } from '../../config.js';
import { ForbiddenError } from '../../api/errors.js';

export async function deleteAllUsers() {
    if (config.api.platform !== 'dev') {
        throw new ForbiddenError('This action is only available in dev mode');
    }
    await db.delete(users);
}
