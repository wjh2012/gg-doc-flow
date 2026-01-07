import { Module } from '@nestjs/common';
import { DatabaseModule } from './infra/database/database.module';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bullmq';
import { TaskService } from './task/task.service';
import { TaskController } from './task/task.controller';
import { DocFlowQueueModule } from './infra/message/doc-flow-queue.module';

@Module({
  imports: [
    DatabaseModule,
    CacheModule.register(),
    BullModule.forRoot({
      connection: {
        host: '127.0.0.1',
        port: 6379,
      },
    }),
    DocFlowQueueModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class AppModule { }
