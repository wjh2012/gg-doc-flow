import { sql } from 'kysely';
import * as PersonRepository from './PersonRepository';
import { after, before } from 'node:test';
import { db } from '../infra/database';

describe('PersonRepository', () => {
  before(async () => {
    await db.schema
      .createTable('person')
      .addColumn('id', 'integer', (cb) =>
        cb.primaryKey().autoIncrement().notNull(),
      )
      .addColumn('first_name', 'varchar(255)', (cb) => cb.notNull())
      .addColumn('last_name', 'varchar(255)')
      .addColumn('gender', 'varchar(50)', (cb) => cb.notNull())
      .addColumn('created_at', 'timestamp', (cb) =>
        cb.notNull().defaultTo(sql`current_timestamp`),
      )
      .execute();
  });

  afterEach(async () => {
    await sql`delete from ${sql.table('person')}`.execute(db);
  });

  after(async () => {
    await db.schema.dropTable('person').execute();
  });

  it('should find a person with a given id', async () => {
    await PersonRepository.findPersonById(123);
  });

  it('should find all people named Arnold', async () => {
    await PersonRepository.findPeople({ first_name: 'Arnold' });
  });

  it('should update gender of a person with a given id', async () => {
    await PersonRepository.updatePerson(123, { gender: 'woman' });
  });

  it('should create a person', async () => {
    await PersonRepository.createPerson({
      first_name: 'Jennifer',
      last_name: 'Aniston',
      gender: 'woman',
    });
  });

  it('should delete a person with a given id', async () => {
    await PersonRepository.deletePerson(123);
  });
});
