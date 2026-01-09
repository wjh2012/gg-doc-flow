import * as path from 'path';
import { promises as fs } from 'fs';
import DatabaseDriver from 'better-sqlite3';
import { FileMigrationProvider, Kysely, Migrator, SqliteDialect } from 'kysely';
import { Database } from './types/database.types';

async function migrateToLatest() {
  const db = new Kysely<Database>({
    dialect: new SqliteDialect({
      database: new DatabaseDriver(path.join(process.cwd(), 'db.sqlite')),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      // console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === 'Error') {
      // console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    // console.error('failed to migrate');
    // console.error(error);
    process.exit(1);
  }

  // SQLite는 destroy가 필수는 아니지만 호출해도 안전
  await db.destroy();
}

migrateToLatest();
