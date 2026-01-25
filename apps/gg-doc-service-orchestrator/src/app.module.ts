import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { DatabaseModule } from '@app/database';
import { DocFlowQueueModule } from './infra/message/doc-flow-queue.module';
import { TaskModule } from './task/task.module';
import { CommonLoggerModule } from '@app/common-logging';

@Module({
  imports: [
    DatabaseModule,
    TaskModule,
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_BULLMQ_PORT || '6380', 10),
      },
    }),
    DocFlowQueueModule,
    CommonLoggerModule,
  ],
})
export class AppModule {}
