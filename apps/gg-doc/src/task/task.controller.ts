import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { TaskService } from './task.service';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('ocr')
  @HttpCode(202)
  async createOcrTask() {
    await this.taskService.publishTask('OCR');
    return;
  }

  @Post('detection')
  @HttpCode(202)
  async createDetectionTask() {
    await this.taskService.publishTask('DETECTION');
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
