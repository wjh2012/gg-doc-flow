import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DocFlowQueueProducer } from './doc-flow-queue.producer';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'ocr-queue',
      },
      {
        name: 'masking-queue',
      },
    ),
  ],
  providers: [DocFlowQueueProducer],
  exports: [DocFlowQueueProducer],
})
export class DocFlowQueueModule {}
