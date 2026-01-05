import SQLite from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { Database } from '../types/database-types';

const dialect = new SqliteDialect({
  database: new SQLite(':memory:'),
});

export const db = new Kysely<Database>({
  dialect,
});
