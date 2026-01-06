import { Module } from '@nestjs/common';
import { KYSELY_DB, KyselyProvider } from './kysely.provider';

@Module({
  providers: [KyselyProvider],
  exports: [KYSELY_DB],
})
export class DatabaseModule {}
