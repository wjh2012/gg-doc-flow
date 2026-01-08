import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DatabaseModule } from '@app/database';
import { DocFlowModule } from './worker/doc-flow.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6380,
      },
    }),
    DatabaseModule,
    DocFlowModule,
  ],
  providers: [],
})
export class OcrWorkerModule {}
