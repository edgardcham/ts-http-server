import { pgTable, timestamp, varchar, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    email: varchar('email', { length: 255 }).notNull().unique(),
    hashedPassword: varchar('hashed_password', { length: 255 })
        .notNull()
        .default('unset'),
});

export const chirps = pgTable('chirps', {
    id: uuid('id').primaryKey().defaultRandom(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    body: varchar('body', { length: 140 }).notNull(),
    user_id: uuid('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
});

export type NewUser = typeof users.$inferInsert;
export type NewChirp = typeof chirps.$inferInsert;
