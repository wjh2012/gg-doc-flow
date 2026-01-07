import { Controller, Get, HttpCode, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) { }

  @Get('test')
  @HttpCode(202)
  async taskTest() {
    await this.taskService.publishTask();
    return;
  }

  @Get('recent/hour')
  async getTasksLastHour() {
    return this.taskService.getTasksLastHour();
  }

  @Get('recent')
  async getRecentTasks(@Query('limit', new DefaultValuePipe(100), ParseIntPipe) limit: number) {
    return this.taskService.getRecentTasks(limit);
  }
}
