import {
  Controller,
  Get,
  HttpCode,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('test')
  @HttpCode(202)
  async taskTest() {
    await this.taskService.publishTask();
    return;
  }

  @Get('recent')
  async getRecentTasks(
    @Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number,
  ) {
    return this.taskService.getRecentTasks(limit);
  }

  @EventPattern('task_status_updates')
  handleTaskStatus(data: any) {
    this.taskService.broadcastTaskStatus(data);
  }
}
