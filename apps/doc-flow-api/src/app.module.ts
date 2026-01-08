import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { BullModule } from '@nestjs/bullmq';
import { DocFlowQueueModule } from './infra/message/doc-flow-queue.module';
import { TaskModule } from './task/task.module';
import { ViewController } from './view/view.controller';

@Module({
  imports: [
    DatabaseModule,
    TaskModule,
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6380,
      },
    }),
    DocFlowQueueModule,
  ],
  controllers: [ViewController],
})
export class AppModule {}
