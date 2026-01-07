import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DocFlowModule } from './worker/doc-flow.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),
    DocFlowModule,
  ],
  providers: [],
})
export class OcrWorkerModule {}
