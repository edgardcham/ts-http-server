import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import * as schema from './schema.js';
import { config } from '../config.js';

// setup the connection
const conn = postgres(config.db.url);
export const db = drizzle(conn, { schema });
