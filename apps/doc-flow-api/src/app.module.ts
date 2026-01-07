import { Module } from '@nestjs/common';
import { DatabaseModule } from '@app/database';
import { CacheModule } from '@nestjs/cache-manager';
import { BullModule } from '@nestjs/bullmq';
import { DocFlowQueueModule } from './infra/message/doc-flow-queue.module';
import { TaskModule } from './task/task.module';
import KeyvRedis from '@keyv/redis';

@Module({
  imports: [
    DatabaseModule,
    TaskModule,
    CacheModule.registerAsync({
      useFactory: () => {
        return {
          stores: [new KeyvRedis('redis://localhost:6379')],
        };
      },
    }),
    BullModule.forRoot({
      connection: {
        host: '127.0.0.1',
        port: 6380,
      },
    }),
    DocFlowQueueModule,
  ],
})
export class AppModule {}
