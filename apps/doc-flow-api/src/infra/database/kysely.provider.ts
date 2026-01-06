import { Kysely, SqliteDialect } from 'kysely';
import BetterSqlite3 from 'better-sqlite3';
import { Database } from './types/database.types';

export const KYSELY_DB = 'KYSELY_DB';

export const KyselyProvider = {
  provide: KYSELY_DB,
  useFactory: () => {
    const sqlite = new BetterSqlite3('db.sqlite');

    return new Kysely<Database>({
      dialect: new SqliteDialect({
        database: sqlite,
      }),
    });
  },
};
