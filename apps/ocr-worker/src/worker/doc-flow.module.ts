import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bullmq';
import { DocFlowWorker } from './doc-flow.worker';
import { DocFlowService } from './doc-flow.service';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [
    DatabaseModule,
    CacheModule.register({ ttl: 3600000 }),
    BullModule.registerQueue({
      name: 'ocr-queue',
    }),
  ],
  providers: [DocFlowWorker, DocFlowService],
})
export class DocFlowModule {}
