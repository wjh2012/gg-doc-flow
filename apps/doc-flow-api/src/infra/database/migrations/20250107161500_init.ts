import { Kysely } from 'kysely';

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('task')
    .ifNotExists()
    .addColumn('id', 'text', (c) => c.primaryKey())
    .addColumn('task_type', 'text', (c) => c.notNull())
    .addColumn('status', 'text', (c) => c.notNull())
    .addColumn('payload', 'text')
    .addColumn('result', 'text')
    .addColumn('created_at', 'datetime')
    .addColumn('started_at', 'datetime')
    .addColumn('finished_at', 'datetime')
    .addColumn('error_message', 'text')
    .execute();
}
