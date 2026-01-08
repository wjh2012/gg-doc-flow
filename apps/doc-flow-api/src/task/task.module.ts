import { DocFlowQueueModule } from '../infra/message/doc-flow-queue.module';
import { DatabaseModule } from '@app/database';
import { TaskService } from './task.service';
import { Module } from '@nestjs/common';
import { ITaskRepository } from './task.repository.interface';

import { TaskController } from './task.controller';
import { TaskSseController } from './task.sse.controller';
import { KyselyTaskRepository } from './infra/kysely.task.repository';

@Module({
  imports: [
    DocFlowQueueModule,
    DatabaseModule,
  ],
  providers: [
    TaskService,
    {
      provide: ITaskRepository,
      useClass: KyselyTaskRepository,
    },
  ],
  controllers: [TaskController, TaskSseController],
})
export class TaskModule { }
