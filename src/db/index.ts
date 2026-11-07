import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL must be configured before starting MEDSPACE.');

const connection = postgres(databaseUrl, {
  max: 10,
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  prepare: false,
});

export const db = drizzle(connection);
