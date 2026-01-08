import { Controller, Sse } from '@nestjs/common';
import { TaskService, TaskStatusEvent } from './task.service';
import { Observable } from 'rxjs';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Task SSE')
@Controller('task')
export class TaskSseController {
  constructor(private readonly taskService: TaskService) {}

  @Sse('sse')
  sse(): Observable<TaskStatusEvent> {
    return this.taskService.getTaskStatusStream();
  }
}
