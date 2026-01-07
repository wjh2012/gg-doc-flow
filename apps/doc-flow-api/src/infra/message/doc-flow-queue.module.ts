import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DocFlowQueueProducer } from './doc-flow-queue.producer';

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: 'ocr-flow',
      },
      {
        name: 'masking-flow',
      },
    ),
  ],
  providers: [DocFlowQueueProducer],
  exports: [DocFlowQueueProducer],
})
export class DocFlowQueueModule {}
