import { DocFlowQueueModule } from '../infra/message/doc-flow-queue.module';
import { DatabaseModule } from '@app/database';
import { CacheModule } from '@nestjs/cache-manager';
import { TaskService } from './task.service';
import { Module } from '@nestjs/common';
import { ITaskRepository } from './task.repository.interface';
import { KyselyTaskCacheRepository } from './infra/kysely.task.cache.repository';

import { TaskController } from './task.controller';

@Module({
  imports: [DocFlowQueueModule, DatabaseModule, CacheModule.register()],
  providers: [
    TaskService,
    {
      provide: ITaskRepository,
      useClass: KyselyTaskCacheRepository,
    },
  ],
  controllers: [TaskController],
})
export class TaskModule { }
