import { Kysely } from 'kysely';

export async function up(db: Kysely<any>) {
  await db.schema
    .createTable('user')
    .ifNotExists()
    .addColumn('id', 'integer', (c) => c.primaryKey().autoIncrement())
    .addColumn('email', 'text', (c) => c.notNull().unique())
    .addColumn('password', 'text', (c) => c.notNull())
    .addColumn('name', 'text', (c) => c.notNull())
    .addColumn('role', 'text', (c) => c.notNull().defaultTo('user'))
    .addColumn('profile', 'text')
    .addColumn('created_at', 'datetime', (c) =>
      c.notNull().defaultTo(new Date().toISOString()),
    )
    .addColumn('updated_at', 'datetime')
    .execute();
}

export async function down(db: Kysely<any>) {
  await db.schema.dropTable('user').execute();
}
